package service

import (
	"cart/errs"
	"cart/logs"
	"cart/repository"
	"errors"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type cartService struct {
	cartRepo repository.CartRepository
}

func NewCartService(cartRepo repository.CartRepository) CartsService {
	return cartService{cartRepo: cartRepo}
}

// Get logged in user carts   =>   /api/v1/carts/me
func (s cartService) SetCart(c *gin.Context) error {
	userId, ok := c.MustGet("oid").(string)
	if !ok {
		logs.Error(errors.New("Not found id"))
		return errs.NewBadRequestError("Not found id")
	}

	cart := repository.Cart{}
	if err := c.ShouldBindJSON(&cart); err != nil {
		logs.Error(err)
		return errs.NewInternalServerError()
	}

	err := s.cartRepo.GetOneAndUpdate(userId, cart)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			err = s.cartRepo.NewCart(userId, cart)
			if err != nil {
				logs.Error(err)
				return errs.NewInternalServerError()
			}
		} else {
			logs.Error(err)
			return errs.NewInternalServerError()
		}
	}

	return nil
}

// Get single cart   =>   /cart/:id
func (s cartService) GetCart(c *gin.Context) (*repository.Cart, error) {
	userId, ok := c.MustGet("oid").(string)
	if !ok {
		logs.Error(errors.New("Not found id"))
		return nil, errs.NewBadRequestError("Not found id")
	}

	cart, err := s.cartRepo.GetCart(userId)
	if err != nil {
		logs.Error(err)
		if err == mongo.ErrNoDocuments {
			return nil, errs.NewNotFoundError("Not found document")
		}
		return nil, errs.NewInternalServerError()
	}

	return cart, nil
}
