package handler

func (r routes) Router(handler cartsHandler) {
	r.router.GET("/", tokenAuthMiddleware(), handler.getCart)
	r.router.POST("/", tokenAuthMiddleware(), handler.setCart)
}
