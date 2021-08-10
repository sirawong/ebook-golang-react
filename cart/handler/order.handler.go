package handler

import (
	"cart/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func NewCartsHandler(cartsSrv service.CartsService) cartsHandler {
	return cartsHandler{cartsSrv: cartsSrv}
}

type cartsHandler struct {
	cartsSrv service.CartsService
}

func (h cartsHandler) setCart(c *gin.Context) {
	err := h.cartsSrv.SetCart(c)
	if err != nil {
		handleError(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"success": true})
	return
}

func (h cartsHandler) getCart(c *gin.Context) {
	cart, err := h.cartsSrv.GetCart(c)
	if err != nil {
		handleError(c, err)
		return
	}
	c.JSON(http.StatusOK, cart)
	return
}
