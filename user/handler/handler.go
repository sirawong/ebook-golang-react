package handler

import (
	"auth/errs"
	"net/http"

	"github.com/gin-gonic/gin"
)

func handleError(c *gin.Context, err error) {
	switch e := err.(type) {
	case errs.AppError:
		c.AbortWithStatusJSON(e.Code, gin.H{"error": e.Message})
	case error:
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": e.Error()})
	}
}
