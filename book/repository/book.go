package repository

import (
	"io"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type BookResponse struct {
	Data       []Book           `bson:"data"`
	TotalCount []map[string]int `bson:"totalCount"`
}

type Book struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Title       string             `bson:"title,omitempty"`
	Author      string             `bson:"author,omitempty"`
	Description string             `bson:"description,omitempty"`
	Genres      []string           `bson:"genres,omitempty"`
	Characters  []string           `bson:"characters,omitempty"`
	Images      Image              `bson:"images,omitempty"`
	ImagesLink  []string           `bson:"imageslink,omitempty"`
	Price       float64            `bson:"price"`
	Rating      float64            `bson:"rating"`
	NumRatings  int32              `bson:"numRatings"`
	User        primitive.ObjectID `bson:"user,omitempty"`
	CreatedAt   time.Time          `bson:"createdAt,omitempty"`
	UpdatedAt   time.Time          `bson:"updatedAt,omitempty"`
}

type Image struct {
	PublicID string `bson:"publicId,omitempty"`
	ImageUrl string `bson:"url,omitempty"`
}

type BookRepository interface {
	UploadImage(image io.Reader) (*Image, error)
	DeleteImage(image Image) error

	CheckBook(bookTitle string) error
	CreateNewBook(book Book) (string, error)
	GetAllBooks(limit, sort, skip int) (*[]Book, error)
	GetfilterBooks(query string, sortRating, sortPrice, limit, skip int, gtPrice, ltPrice, gtRating float64) (*[]BookResponse, error)
	GetBook(id string) (*Book, error)
	UpdateBook(id string, updatedBook Book) error
	DeleteBook(id string) error
}
