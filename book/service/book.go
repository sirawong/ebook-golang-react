package service

import (
	"book/repository"

	"github.com/gin-gonic/gin"
)

type BookServices struct {
	ID          string           `json:"id,omitempty"`
	Title       string           `json:"title,omitempty"`
	Author      string           `json:"author,omitempty"`
	Description string           `json:"description,omitempty"`
	Language    string           `json:"language,omitempty"`
	Isbn        int64            `json:"isbn,omitempty"`
	Genres      []string         `json:"genres,omitempty"`
	Characters  []string         `json:"characters,omitempty"`
	Pages       int32            `json:"pages,omitempty"`
	Publisher   string           `json:"publisher,omitempty"`
	Price       float64          `json:"price"`
	Stock       int32            `json:"stock,omitempty"`
	Rating      float64          `json:"rating"`
	User        string           `json:"user,omitempty"`
	NumRatings  int32            `json:"num_ratings"`
	ImagesLink  []string         `json:"imageslink,omitempty"`
	Images      repository.Image `json:"images,omitempty"`

	CreatedAt string `json:"createdAt,omitempty" form:"createdAt,omitempty"`
	UpdatedAt string `json:"updatedAt,omitempty" form:"updatedAt,omitempty"`
}

type BooksService interface {
	GetFilterBooks(c *gin.Context) (*[]BookServices, int, error)
	GetBook(c *gin.Context) (*BookServices, error)

	AdminGetBooks(c *gin.Context) (*[]BookServices, error)
	AdminNewBook(c *gin.Context) (*string, error)
	AdminUpdateBook(c *gin.Context) error
	AdminDeleteBook(c *gin.Context) error

	PostImageBook(c *gin.Context) (*BookServices, error)
}
