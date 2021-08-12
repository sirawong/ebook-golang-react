package handler

import (
	"auth/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func NewUserHandler(userSrv service.UserService) userHandler {
	return userHandler{userSrv: userSrv}
}

type userHandler struct {
	userSrv service.UserService
}

// register user
func (h userHandler) register(c *gin.Context) {
	token, err := h.userSrv.RegisterService(c)
	if err != nil {
		handleError(c, err)
		return
	}

	tk := *token
	c.SetCookie("ac", tk["access_token"], 60*15, "/", "localhost", false, false)       // Maxage 15 minutes
	c.SetCookie("rf", tk["refresh_token"], 60*60*24*7, "/", "localhost", false, false) // Maxage 7 days

	c.JSON(http.StatusCreated, gin.H{"message": "Register successfully"})
	return
}

// login user
func (h userHandler) login(c *gin.Context) {
	token, err := h.userSrv.LoginService(c)
	if err != nil {
		handleError(c, err)
		return
	}
	tk := *token

	c.SetCookie("ac", tk["access_token"], 60*15, "/", "localhost", false, false)       // Maxage 15 minutes
	c.SetCookie("rf", tk["refresh_token"], 60*60*24*7, "/", "localhost", false, false) // Maxage 7 days

	c.JSON(http.StatusCreated, gin.H{"message": "Login successfully", "level": tk["level"], "image": tk["image"]})
	return
}

// logout user
func (h userHandler) logout(c *gin.Context) {
	err := h.userSrv.LogoutService(c)
	if err != nil {
		handleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "user logout"})
	return
}

// update user
func (h userHandler) updateUser(c *gin.Context) {
	err := h.userSrv.UpdateUserService(c)
	if err != nil {
		handleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "user updated"})
	return
}

// get user by id
func (h userHandler) getUser(c *gin.Context) {
	user, err := h.userSrv.GetUserService(c)
	if err != nil {
		handleError(c, err)
		return
	}
	c.JSON(http.StatusOK, user)
	return
}

// upload images photo
func (h userHandler) uploadImage(c *gin.Context) {
	imagelink, err := h.userSrv.PostImageProfile(c)
	if err != nil {
		handleError(c, err)
		return
	}
	c.JSON(http.StatusAccepted, imagelink)
	return
}

// get all user by admin
func (h userHandler) getAllUsers(c *gin.Context) {
	users, err := h.userSrv.GetAllUsers(c)
	if err != nil {
		handleError(c, err)
		return
	}
	c.JSON(http.StatusOK, users)
	return
}

// create user by admin
// func (h userHandler) createUserByAdmin(c *gin.Context) {
// 	users, err := h.userSrv.AdminNewUser(c)
// 	if err != nil {
// 		handleError(c, err)
// 		return
// 	}
// 	c.JSON(http.StatusOK, users)
// 	return
// }

// update user by admin
// func (h userHandler) updateAdminUser(c *gin.Context) {
// 	user, err := h.userSrv.UpdateAdminService(c)
// 	if err != nil {
// 		handleError(c, err)
// 		return
// 	}
// 	c.JSON(http.StatusOK, user)
// 	return
// }

// delete user by admin
// func (h userHandler) deleteAdminUser(c *gin.Context) {
// 	err := h.userSrv.DeleteAdminService(c)
// 	if err != nil {
// 		handleError(c, err)
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"message": "user deleted"})
// 	return
// }

// regenerate token by refresh token
func (h userHandler) refeshToken(c *gin.Context) {
	token, err := h.userSrv.Refresh(c)
	if err != nil {
		handleError(c, err)
		return
	}

	tk := *token
	c.SetCookie("ac", tk["access_token"], 60*15, "/", "localhost", false, false)       // Maxage 15 minutes
	c.SetCookie("rf", tk["refresh_token"], 60*60*24*7, "/", "localhost", false, false) // Maxage 7 days

	c.JSON(http.StatusCreated, gin.H{"message": "Generate token successfully"})
	return
}
