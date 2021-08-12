package service

import (
	"auth/errs"
	"auth/logs"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v7"
	"github.com/spf13/viper"
	"github.com/twinj/uuid"
)

var client *redis.Client

func InitRedis() {
	//Initializing redis
	dsn := viper.GetString("redis.dsn")
	client = redis.NewClient(&redis.Options{
		Addr: dsn,
	})
	_, err := client.Ping().Result()
	if err != nil {
		panic(err)
	}
}

// Extract Token and return userId
func ExtractTokenMetadata(c *http.Request) (*AccessDetails, error) {
	token, err := verifyToken(c)
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		accessUuid, ok := claims["access_uuid"].(string)
		if !ok {
			return nil, err
		}

		return &AccessDetails{
			AccessUuid: accessUuid,
			UserId:     fmt.Sprintln(claims["user_id"]),
		}, nil
	}
	return nil, err
}

// Varify Token
func verifyToken(c *http.Request) (*jwt.Token, error) {
	tokenString := extractToken(c)
	if tokenString == "" {
		return nil, errors.New("Not found token")
	}
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(viper.GetString("ACCESS_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}

// Extract token from request header
func extractToken(c *http.Request) string {
	cookie, _ := c.Cookie("ac")
	return cookie.Value
}

// create new token
func createToken(userid string) (*TokenDetails, error) {
	td := &TokenDetails{}
	// access token 15 minutes
	td.AtExpires = time.Now().Add(time.Minute * 15).Unix()
	td.AccessUuid = uuid.NewV4().String()

	// refresh token 7 days
	td.RtExpires = time.Now().Add(time.Hour * 24 * 7).Unix()
	td.RefreshUuid = uuid.NewV4().String()
	var err error
	//Creating Access Token
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["access_uuid"] = td.AccessUuid
	atClaims["user_id"] = userid
	atClaims["exp"] = td.AtExpires
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	td.AccessToken, err = at.SignedString([]byte(viper.GetString("ACCESS_SECRET")))
	if err != nil {
		return nil, err
	}

	//Creating Refresh Token
	rtClaims := jwt.MapClaims{}
	rtClaims["refresh_uuid"] = td.RefreshUuid
	rtClaims["user_id"] = userid
	rtClaims["exp"] = td.RtExpires
	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	td.RefreshToken, err = rt.SignedString([]byte(viper.GetString("REFRESH_SECRET")))
	if err != nil {
		return nil, err
	}
	return td, nil
}

// save token in redis
func createSessionAuth(userid string, td *TokenDetails) error {
	at := time.Unix(td.AtExpires, 0) //converting Unix to UTC(to Time object)
	rt := time.Unix(td.RtExpires, 0)
	now := time.Now()

	errAccess := client.Set(td.AccessUuid, userid, at.Sub(now)).Err()
	if errAccess != nil {
		return errAccess
	}

	errRefresh := client.Set(td.RefreshUuid, userid, rt.Sub(now)).Err()
	if errRefresh != nil {
		return errRefresh
	}

	return nil
}

// Check token is still useful or it has expired
func TokenValid(c *http.Request) error {
	token, err := verifyToken(c)
	if err != nil {
		return err
	}
	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		return err
	}
	return nil
}

// get userid in redis
func FetchAuth(authD *AccessDetails) (string, error) {
	userId, err := client.Get(authD.AccessUuid).Result()
	if err != nil {
		return "", err
	}
	return userId, nil
}

// delete token in redis
func deleteSessionAuth(givenUuid string) (int64, error) {
	deleted, err := client.Del(givenUuid).Result()
	if err != nil {
		return 0, err
	}
	return deleted, nil
}

func deleteRefreshToken(c *gin.Context) error {
	refreshToken, err := c.Cookie("rf")
	if err != nil {
		return errs.NewUnauthorizedError()
	}

	//verify the token
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(viper.GetString("REFRESH_SECRET")), nil
	})
	//if there is an error, the token must have expired
	if err != nil {
		return errs.NewUnauthorizedError()
	}
	//is token valid?
	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		return errs.NewUnauthorizedError()
	}

	//Since token is valid, get the uuid:
	claims, ok := token.Claims.(jwt.MapClaims) //the token claims should conform to MapClaims
	if ok && token.Valid {
		refreshUuid, ok := claims["refresh_uuid"].(string) //convert the interface to string
		if !ok {
			return errs.NewInternalServerError()
		}

		//Delete the previous Refresh Token
		deleted, err := deleteSessionAuth(refreshUuid)
		if err != nil || deleted == 0 { //if any goes wrong`
			return errs.NewUnauthorizedError()
		}

	} else {
		logs.Error("refresh expired")
		return errs.NewUnauthorizedError()
	}

	return nil
}
