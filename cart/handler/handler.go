package handler

import (
	"cart/errs"
	"net/http"

	"github.com/gin-gonic/gin"
)

func handleError(c *gin.Context, err error) {
	switch e := err.(type) {
	case errs.AppError:
		c.JSON(e.Code, gin.H{"message": e.Message})
	case error:
		c.JSON(http.StatusInternalServerError, gin.H{"message": e.Error()})
	}
}
