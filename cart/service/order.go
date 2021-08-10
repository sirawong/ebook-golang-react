package service

import (
	"cart/repository"

	"github.com/gin-gonic/gin"
)

type CartsService interface {
	SetCart(c *gin.Context) error
	GetCart(c *gin.Context) (*repository.Cart, error)
}
