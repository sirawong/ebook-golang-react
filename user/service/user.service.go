package service

import (
	"auth/errs"
	"auth/logs"
	"auth/repository"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	return userService{userRepo: userRepo}
}

// register new user
func (s userService) RegisterService(c *gin.Context) (*map[string]string, error) {
	user := repository.User{}
	if err := c.ShouldBindJSON(&user); err != nil {
		logs.Error(err)
		return nil, errs.NewNotAcceptableError("invalid json")
	}

	// hash password
	hashpass, err := HashPassword(user.Password)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}

	// save in database
	user.Password = hashpass
	user.Level = "user"
	user.CreatedAt = time.Now()
	result, err := s.userRepo.CreateUser(user)
	if err != nil {
		logs.Error(user.Email + " : " + err.Error())
		if err.Error() == "User already exists" {
			return nil, errs.NewNotAcceptableError("User already exists")
		}
		return nil, errs.NewInternalServerError()
	}

	// create token
	userId := result.ID.Hex()
	resultToken, err := createToken(userId)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}

	// save token in redis
	saveErr := createSessionAuth(userId, resultToken)
	if saveErr != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}

	tokens := map[string]string{
		"access_token":  resultToken.AccessToken,
		"refresh_token": resultToken.RefreshToken,
	}

	return &tokens, nil
}

// login user service
func (s userService) LoginService(c *gin.Context) (*map[string]string, error) {
	user := repository.User{}

	if err := c.ShouldBindJSON(&user); err != nil {
		logs.Error(err)
		return nil, errs.NewNotAcceptableError("invalid json")
	}

	// check user exists
	result, err := s.userRepo.GetUserByEmail(user)
	if err != nil {
		logs.Error(err)
		if err == mongo.ErrNoDocuments {
			return nil, errs.NewUnauthorizedError()
		}
		return nil, errs.NewInternalServerError()
	}

	// check password hash
	checkHash := CheckPasswordHash(user.Password, result.Password)
	if !checkHash {
		logs.Error("Incorrect password : " + user.Email)
		return nil, errs.NewUnauthorizedError()
	}

	// create token
	userId := result.ID.Hex()
	resultToken, err := createToken(userId)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}

	// save token in redis
	saveErr := createSessionAuth(userId, resultToken)
	if saveErr != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}
	tokens := map[string]string{
		"access_token":  resultToken.AccessToken,
		"refresh_token": resultToken.RefreshToken,
		"level":         result.Level,
		"image":         result.Image.ImageUrl,
	}

	return &tokens, nil
}

// logout service
func (s userService) LogoutService(c *gin.Context) error {
	au, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		logs.Error(err)
		return errs.NewInternalServerError()
	}
	deleted, err := deleteSessionAuth(au.AccessUuid)
	logs.Error(err)
	if err != nil || deleted == 0 {
		logs.Error(err)
		return errs.NewInternalServerError()
	}
	err = deleteRefreshToken(c)
	if err != nil {
		logs.Error(err)
		return err
	}

	return nil
}

// get level from id
func (s userService) GetLevelfromId(id primitive.ObjectID) (*string, error) {
	user, err := s.userRepo.GetById(id)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}

	return &user.Level, nil
}

// get info user by own
func (s userService) GetUserService(c *gin.Context) (*UserResponse, error) {
	oid, err := GetIDfromToken(c)
	if err != nil {
		return nil, err
	}

	// get user by id
	userResult, err := s.userRepo.GetById(*oid)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}

	return &UserResponse{Name: userResult.Name, Lastname: userResult.Lastname, Email: userResult.Email, Image: userResult.Image.ImageUrl}, nil
}

// update user by own
func (s userService) UpdateUserService(c *gin.Context) error {
	// get userid
	oid, err := GetIDfromToken(c)
	if err != nil {
		return errs.NewUnauthorizedError()
	}

	var user repository.User
	if err := c.ShouldBindJSON(&user); err != nil {
		logs.Error(err)
		return errs.NewNotAcceptableError("invalid json")
	}

	findUser, err := s.userRepo.GetById(*oid)
	if err != nil {
		logs.Error(err)
		return errs.NewInternalServerError()
	}

	if user.Password != "" {
		// hash password
		hashpass, err := HashPassword(user.Password)
		if err != nil {
			logs.Error(err)
			return errs.NewInternalServerError()
		}
		findUser.Password = hashpass
	}

	findUser.Name = user.Name
	findUser.Lastname = user.Lastname
	findUser.Email = user.Email
	findUser.UpdatedAt = time.Now()

	// update user in database
	err = s.userRepo.UpdateUser(*findUser)
	if err != nil {
		logs.Error(err)
		return errs.NewInternalServerError()
	}
	return nil
}

// get info all user by admin
func (s userService) GetAllUsers(c *gin.Context) (*[]repository.User, error) {
	page := c.DefaultQuery("page", "0")
	skip, err := strconv.Atoi(page)
	if err != nil {
		skip = 0
	}

	limitQuery := c.DefaultQuery("limit", "5")
	limit, err := strconv.Atoi(limitQuery)
	if err != nil {
		limit = 5
	}

	query := c.Query("query")
	users := &[]repository.User{}

	// get user by query
	users, err = s.userRepo.GetfilterUser(query, limit, skip)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()

	}
	return users, nil
}

// update info user by admin
func (s userService) UpdateAdminService(c *gin.Context) (*repository.User, error) {
	id, _ := c.Params.Get("id")
	if id == "" {
		logs.Error("Not found id")
		return nil, errs.NewBadRequestError("Not found id")
	}

	var user repository.User
	if err := c.ShouldBindJSON(&user); err != nil {
		logs.Error(err)
		return nil, errs.NewNotAcceptableError("invalid json")
	}

	oid, _ := primitive.ObjectIDFromHex(id)

	user.ID = oid
	user.UpdatedAt = time.Now()

	// update user in database
	err := s.userRepo.UpdateUser(user)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}
	return &user, nil
}

// delete user by admin
func (s userService) DeleteAdminService(c *gin.Context) error {
	id, _ := c.Params.Get("id")
	if id == "" {
		logs.Error("Not found id")
		return errs.NewBadRequestError("Not found id")
	}

	oid, _ := primitive.ObjectIDFromHex(id)

	// find old image and delete
	userFind, err := s.userRepo.GetById(oid)
	if err != nil {
		logs.Error(err)
		return errs.NewInternalServerError()
	}
	if err = s.userRepo.DeleteImage(userFind.Image); err != nil {
		logs.Error(err)
		return errs.NewInternalServerError()
	}

	// delete user
	err = s.userRepo.DeleteUser(oid)
	if err != nil {
		logs.Error(err)
		return errs.NewInternalServerError()
	}
	return nil
}

// update or upload new image profile
func (s userService) PostImageProfile(c *gin.Context) (*UserResponse, error) {
	var oid *primitive.ObjectID
	var err error

	id, _ := c.Params.Get("id")
	if id == "" {
		oid, err = GetIDfromToken(c)
		if err != nil {
			logs.Error(err)
			return nil, errs.NewUnauthorizedError()
		}
	} else {
		*oid, err = primitive.ObjectIDFromHex(id)
		if err != nil {
			logs.Error(err)
			return nil, errs.NewInternalServerError()
		}
	}

	// find old image
	userFind, err := s.userRepo.GetById(*oid)
	if err != nil {
		if err != mongo.ErrNoDocuments {
			logs.Error(err)
			return nil, errs.NewInternalServerError()
		} else {
			// delete old image
			if err = s.userRepo.DeleteImage(userFind.Image); err != nil {
				logs.Error(err)
				return nil, errs.NewInternalServerError()
			}
		}
	}
	var uploaded *repository.Image

	image, _, err := c.Request.FormFile("image")
	if err != nil {
		if err != http.ErrMissingFile {
			logs.Error(err)
			return nil, errs.NewInternalServerError()
		}
	} else {
		// Upload new images
		uploaded, err = s.userRepo.UploadImage(image)
		if err != nil {
			logs.Error(err)
			return nil, errs.NewInternalServerError()
		}
		defer image.Close()
		if userFind == nil {
			userFind = &repository.User{}
		}
		userFind.Image = *uploaded
	}

	// update in database
	err = s.userRepo.UpdateUser(*userFind)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}

	return &UserResponse{Image: uploaded.ImageUrl}, nil
}

// get new token when access_token is expired by refresh_token
func (s userService) Refresh(c *gin.Context) (*map[string]string, error) {
	refreshToken, err := c.Cookie("rf")
	if err != nil {
		logs.Error(err)
		return nil, errs.NewUnauthorizedError()
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
		logs.Error(err)
		return nil, errs.NewUnauthorizedError()
	}
	//is token valid?
	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		logs.Error(err)
		return nil, errs.NewUnauthorizedError()
	}

	//Since token is valid, get the uuid:
	claims, ok := token.Claims.(jwt.MapClaims) //the token claims should conform to MapClaims
	tokens := map[string]string{}
	if ok && token.Valid {
		refreshUuid, ok := claims["refresh_uuid"].(string) //convert the interface to string
		if !ok {
			logs.Error(err)
			return nil, errs.NewInternalServerError()
		}
		userId := fmt.Sprint(claims["user_id"])

		//Delete the previous Refresh Token
		deleted, err := deleteSessionAuth(refreshUuid)
		if err != nil || deleted == 0 { //if any goes wrong`
			logs.Error(err)
			return nil, errs.NewInternalServerError()
		}
		//Create new pairs of refresh and access tokens
		newToken, createErr := createToken(userId)
		if createErr != nil {
			logs.Error(err)
			return nil, errs.NewInternalServerError()
		}
		//save the tokens metadata to redis
		saveErr := createSessionAuth(userId, newToken)
		if saveErr != nil {
			logs.Error(err)
			return nil, errs.NewInternalServerError()
		}
		tokens = map[string]string{
			"access_token":  newToken.AccessToken,
			"refresh_token": newToken.RefreshToken,
		}
	} else {
		logs.Error("refresh expired")
		return nil, errs.NewUnauthorizedError()
	}

	return &tokens, nil
}
