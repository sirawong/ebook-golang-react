package handler

func (r routes) Router(handler userHandler) {
	r.router.POST("/signup", handler.register)
	r.router.POST("/signin", handler.login)
	r.router.POST("/logout", tokenAuthMiddleware(), handler.logout)
	r.router.GET("/me", tokenAuthMiddleware(), handler.getUser)
	r.router.PATCH("/me", tokenAuthMiddleware(), handler.updateUser)
	r.router.POST("/me/image", tokenAuthMiddleware(), handler.uploadImage)

	r.router.POST("/token/level", checkTokenLevel(handler)) // check token valid and send level user to another services
	r.router.POST("/token", checkToken(handler))            // check token valid and send oid to another services
	r.router.POST("/token/refresh", handler.refeshToken)    // refresh token

}
