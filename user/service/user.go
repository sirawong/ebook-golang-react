package service

import (
	"auth/errs"
	"auth/logs"
	"auth/repository"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserResponse struct {
	ID       string `json:"id,omitempty"`
	Name     string `json:"name,omitempty"`
	Lastname string `json:"lastname,omitempty"`
	Email    string `json:"email,omitempty"`
	Level    string `json:"level,omitempty"`
	Image    string `json:"image,omitempty"`
}

type LoginRequest struct {
	Email    string `json:"email,omitempty"`
	Password string `json:"password,omitempty"`
}

type UserService interface {
	RegisterService(*gin.Context) (*map[string]string, error)
	LoginService(*gin.Context) (*map[string]string, error)
	LogoutService(*gin.Context) error
	UpdateUserService(*gin.Context) error
	GetUserService(c *gin.Context) (*UserResponse, error)

	GetLevelfromId(id primitive.ObjectID) (*string, error)
	GetAllUsers(c *gin.Context) (*[]repository.User, error)
	UpdateAdminService(c *gin.Context) (*repository.User, error)
	DeleteAdminService(*gin.Context) error

	Refresh(c *gin.Context) (*map[string]string, error)
	PostImageProfile(c *gin.Context) (*UserResponse, error)
}

func GetIDfromToken(c *gin.Context) (*primitive.ObjectID, error) {
	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewUnauthorizedError()
	}
	userId, err := FetchAuth(tokenAuth)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewUnauthorizedError()
	}
	oid, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}

	return &oid, nil
}
