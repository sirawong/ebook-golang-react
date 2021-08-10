package service

import (
	"book/repository"
)

func convSrvToRepo(srv BookServices) (*repository.Book, error) {

	book := &repository.Book{
		Title:       srv.Title,
		Author:      srv.Author,
		Description: srv.Description,
		Genres:      srv.Genres,
		Characters:  srv.Characters,
		Images:      srv.Images,
		ImagesLink:  srv.ImagesLink,
		Price:       srv.Price,
	}
	return book, nil
}

func convRepoToSrv(repo repository.Book) (*BookServices, error) {
	book := &BookServices{
		ID:          repo.ID.Hex(),
		Title:       repo.Title,
		Author:      repo.Author,
		Description: repo.Description,
		Genres:      repo.Genres,
		Characters:  repo.Characters,
		Images:      repo.Images,
		ImagesLink:  repo.ImagesLink,
		Price:       repo.Price,
		CreatedAt:   repo.CreatedAt.String(),
		UpdatedAt:   repo.UpdatedAt.String(),
	}
	return book, nil
}
