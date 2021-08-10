package handler

import (
	"auth/logs"
	"auth/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func tokenAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := service.TokenValid(c.Request)
		if err != nil {
			logs.Error(err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		c.Next()
	}
}

// check token admin
func tokenAuthAdminMiddleware(handler userHandler) gin.HandlerFunc {
	return func(c *gin.Context) {
		err := service.TokenValid(c.Request)
		if err != nil {
			logs.Error(err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		oid, err := service.GetIDfromToken(c)
		if err != nil {
			logs.Error(err)
			handleError(c, err)
			c.Abort()
			return
		}

		level, err := handler.userSrv.GetLevelfromId(*oid)
		if err != nil {
			logs.Error(err)
			handleError(c, err)
			c.Abort()
			return
		}

		if *level != "admin" {
			logs.Error("User Unauthorized")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		c.Next()
	}
}

// check token valid
func checkTokenLevel(handler userHandler) gin.HandlerFunc {
	return func(c *gin.Context) {
		err := service.TokenValid(c.Request)
		if err != nil {
			logs.Error("User Unauthorized")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}

		oid, err := service.GetIDfromToken(c)
		if err != nil {
			logs.Error(err)
			handleError(c, err)
			c.Abort()
			return
		}

		level, err := handler.userSrv.GetLevelfromId(*oid)
		if err != nil {
			logs.Error(err)
			handleError(c, err)
			c.Abort()
			return
		}

		c.JSON(http.StatusOK, gin.H{"level": *level})
		return
	}
}

// check token valid
func checkToken(handler userHandler) gin.HandlerFunc {
	return func(c *gin.Context) {
		err := service.TokenValid(c.Request)
		if err != nil {
			logs.Error("User Unauthorized")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}

		oid, err := service.GetIDfromToken(c)
		if err != nil {
			logs.Error(err)
			handleError(c, err)
			c.Abort()
			return
		}

		c.JSON(http.StatusOK, gin.H{"oid": oid.Hex()})
		return
	}
}
