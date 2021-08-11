package handler

func (r routes) Router(handler cartsHandler) {
	r.router.GET("/order", tokenAuthMiddleware(), handler.getCart)
	r.router.POST("/order", tokenAuthMiddleware(), handler.setCart)
}
