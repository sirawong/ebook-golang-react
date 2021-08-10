package service

import (
	"book/errs"
	"book/logs"
	"book/repository"
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type bookService struct {
	bookRepo repository.BookRepository
}

func NewBookService(bookRepo repository.BookRepository) BooksService {
	return bookService{bookRepo: bookRepo}
}

// BOOKS
// get all products   =>   /api/v1/products?keyword=apple
func (s bookService) GetFilterBooks(c *gin.Context) (*[]BookServices, int, error) {
	query := c.Query("query")

	pageParam := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageParam)
	if err != nil {
		logs.Error(err)
		return nil, 0, errs.NewBadRequestError(err.Error())
	}

	limitParam := c.DefaultQuery("limit", "9")
	resPerPage, err := strconv.Atoi(limitParam)
	if err != nil {
		logs.Error(err)
		return nil, 0, errs.NewBadRequestError(err.Error())
	}

	sortrate := c.Query("sortrate")
	var sortRate int
	if sortrate == "desc" {
		sortRate = -1
	} else if sortrate == "asc" {
		sortRate = 1
	}

	sortprice := c.Query("sortprice")
	var sortPrice int
	if sortprice == "desc" {
		sortPrice = -1
	} else if sortprice == "asc" {
		sortPrice = 1
	}

	gtprice := c.DefaultQuery("gtprice", "0")
	gtPrice, err := strconv.ParseFloat(gtprice, 64)
	if err != nil {
		logs.Error(err)
		return nil, 0, errs.NewBadRequestError(err.Error())
	}

	ltprice := c.DefaultQuery("ltprice", "99999")
	ltPrice, err := strconv.ParseFloat(ltprice, 64)
	if err != nil {
		logs.Error(err)
		return nil, 0, errs.NewBadRequestError(err.Error())
	}

	rating := c.DefaultQuery("rating", "0")
	gtRating, err := strconv.ParseFloat(rating, 64)
	if err != nil {
		logs.Error(err)
		return nil, 0, errs.NewBadRequestError(err.Error())
	}

	books := &[]repository.BookResponse{}
	books, err = s.bookRepo.GetfilterBooks(query, sortRate, sortPrice, resPerPage, page-1, gtPrice, ltPrice, gtRating)
	if err != nil {
		logs.Error(err)
		return nil, 0, errs.NewInternalServerError()
	}

	booksResponse := []BookServices{}
	totalCount := 0
	for _, book := range *books {
		for _, data := range book.Data {
			bookRes := BookServices{
				ID:         data.ID.Hex(),
				Title:      data.Title,
				Author:     data.Author,
				ImagesLink: data.ImagesLink,
				Rating:     data.Rating,
				NumRatings: data.NumRatings,
				Price:      data.Price,
			}
			booksResponse = append(booksResponse, bookRes)
		}
		for _, total := range book.TotalCount {
			totalCount = total["count"]
		}
	}
	return &booksResponse, totalCount, nil
}

// Get single product details   =>   /api/v1/product/:id
func (s bookService) GetBook(c *gin.Context) (*BookServices, error) {
	id, _ := c.Params.Get("id")

	book, err := s.bookRepo.GetBook(id)
	if err != nil {
		logs.Error(err)
		if err == mongo.ErrNoDocuments {
			return nil, errs.NewBadRequestError("Not found id")
		}
		return nil, errs.NewInternalServerError()
	}

	bookResponse := BookServices{
		Title:       book.Title,
		Author:      book.Author,
		Description: book.Description,
		Genres:      book.Genres,
		Characters:  book.Characters,
		ImagesLink:  book.ImagesLink,
		Price:       book.Price,
		Rating:      book.Rating,
		NumRatings:  book.NumRatings,
	}

	return &bookResponse, nil
}

// BOOK ADMIN
// Get all products (Admin)  =>   /api/v1/admin/book?page=
func (s bookService) AdminGetBooks(c *gin.Context) (*[]BookServices, error) {
	pageParam := c.DefaultQuery("page", "0")
	page, err := strconv.Atoi(pageParam)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewBadRequestError(err.Error())
	}

	sort := c.Query("sort")
	var sortInt int
	if sort == "desc" {
		sortInt = -1
	} else {
		sortInt = 1
	}

	books, err := s.bookRepo.GetAllBooks(5, sortInt, page)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}

	booksResponse := []BookServices{}
	for _, book := range *books {
		bookSrv, err := convRepoToSrv(book)
		if err != nil {
			logs.Error(err)
			return nil, errs.NewInternalServerError()
		}
		booksResponse = append(booksResponse, *bookSrv)
	}
	return &booksResponse, nil
}

// Create new product (ADMIN) =>   /api/v1/admin/product/new
func (s bookService) AdminNewBook(c *gin.Context) (*string, error) {
	book := BookServices{}
	if err := c.ShouldBind(&book); err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}
	err := s.bookRepo.CheckBook(book.Title)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewBadRequestError(err.Error())
	}

	bookRepo, err := convSrvToRepo(book)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}

	bookRepo.Rating = float64(0)
	bookRepo.NumRatings = 0

	// create data on database
	oid, err := s.bookRepo.CreateNewBook(*bookRepo)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}

	return &oid, nil
}

// Update Product (ADMIN)  =>   /api/v1/admin/product/:id
func (s bookService) AdminUpdateBook(c *gin.Context) error {
	id, _ := c.Params.Get("id")

	if id == "" {
		logs.Error(errors.New("Not found id"))
		return errs.NewBadRequestError("Not found id")
	}

	book := repository.Book{}
	if err := c.ShouldBindJSON(&book); err != nil {
		logs.Error(err)
		return errs.NewInternalServerError()
	}

	err := s.bookRepo.UpdateBook(id, book)
	if err != nil {
		logs.Error(err)
		return errs.NewInternalServerError()
	}
	return nil
}

// Delete Product (ADMIN) =>   /api/v1/admin/product/:id
func (s bookService) AdminDeleteBook(c *gin.Context) error {
	id, _ := c.Params.Get("id")

	book, err := s.bookRepo.GetBook(id)
	if err != nil {
		logs.Error(err)
		if err == mongo.ErrNoDocuments {
			return errs.NewBadRequestError("Book not found")
		}
		return errs.NewInternalServerError()
	}

	err = s.bookRepo.DeleteImage(book.Images)
	if err != nil {
		logs.Error(err)
		return errs.NewInternalServerError()
	}

	err = s.bookRepo.DeleteBook(id)
	if err != nil {
		logs.Error(err)
		return errs.NewInternalServerError()
	}
	return nil
}

// update or upload new image profile
func (s bookService) PostImageBook(c *gin.Context) (*BookServices, error) {
	var err error

	id, _ := c.Params.Get("id")
	if id == "" {
		if err != nil {
			logs.Error(err)
			return nil, errs.NewBadRequestError("Not found id")
		}
	}

	// find old image
	bookFind, err := s.bookRepo.GetBook(id)
	if err != nil {
		if err != mongo.ErrNoDocuments {
			logs.Error(err)
			return nil, errs.NewBadRequestError("Not found id")
		} else {
			// delete old image
			if err = s.bookRepo.DeleteImage(bookFind.Images); err != nil {
				logs.Error(err)
				return nil, errs.NewInternalServerError()
			}
		}
	}
	var uploaded *repository.Image

	image, _, err := c.Request.FormFile("image")
	if err != nil {
		if err != http.ErrMissingFile {
			logs.Error(err)
			return nil, errs.NewInternalServerError()
		}
	} else {
		// Upload new images
		uploaded, err = s.bookRepo.UploadImage(image)
		if err != nil {
			logs.Error(err)
			return nil, errs.NewInternalServerError()
		}
		defer image.Close()
		if bookFind == nil {
			bookFind = &repository.Book{}
		}
		bookFind.Images = *uploaded
	}

	var imagelink []string
	imagelink = append(imagelink, uploaded.ImageUrl)

	bookFind.ImagesLink = imagelink

	// update in database
	err = s.bookRepo.UpdateBook(id, *bookFind)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}

	return &BookServices{ImagesLink: imagelink}, nil
}
