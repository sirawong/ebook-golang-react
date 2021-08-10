package handler

func (r routes) Router(handler booksHandler) {

	// BOOKS
	// get all products   =>   /api/v1/products?keyword=apple
	r.router.GET("/", handler.getFilterBooks)
	// Get single product details   =>   /api/v1/product/:id
	r.router.GET("/:id", handler.getBook)

	// ADMIN
	// Create new product (ADMIN) =>   /api/v1/admin/product/new
	r.router.POST("/admin", tokenAuthAdminMiddleware(), handler.adminCreateBook)
	// Update Product (ADMIN)  =>   /api/v1/admin/product/:id
	r.router.PATCH("/admin/:id", tokenAuthAdminMiddleware(), handler.adminUpdateBook)
	// Delete Product (ADMIN) =>   /api/v1/admin/product/:id
	r.router.DELETE("/admin/:id", tokenAuthAdminMiddleware(), handler.adminDeleteBook)

	r.router.POST("/admin/:id/image", tokenAuthAdminMiddleware(), handler.uploadImage)
}
