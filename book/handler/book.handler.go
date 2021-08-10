package handler

import (
	"book/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func NewBooksHandler(booksSrv service.BooksService) booksHandler {
	return booksHandler{booksSrv: booksSrv}
}

type booksHandler struct {
	booksSrv service.BooksService
}

// BOOKS
func (h booksHandler) getFilterBooks(c *gin.Context) {
	booksResponse, total, err := h.booksSrv.GetFilterBooks(c)
	if err != nil {
		handleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": booksResponse, "totalCount": total})
	return
}

func (h booksHandler) getBook(c *gin.Context) {
	getBook, err := h.booksSrv.GetBook(c)
	if err != nil {
		handleError(c, err)
		return
	}
	c.JSON(http.StatusOK, getBook)
	return
}

func (h booksHandler) adminCreateBook(c *gin.Context) {
	oid, err := h.booksSrv.AdminNewBook(c)
	if err != nil {
		handleError(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"id": *oid})
	return
}

func (h booksHandler) adminUpdateBook(c *gin.Context) {
	err := h.booksSrv.AdminUpdateBook(c)
	if err != nil {
		handleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
	return
}

func (h booksHandler) adminDeleteBook(c *gin.Context) {
	err := h.booksSrv.AdminDeleteBook(c)
	if err != nil {
		handleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
	return
}

// upload images photo
func (h booksHandler) uploadImage(c *gin.Context) {
	imagelink, err := h.booksSrv.PostImageBook(c)
	if err != nil {
		handleError(c, err)
		return
	}
	c.JSON(http.StatusAccepted, imagelink)
	return
}
