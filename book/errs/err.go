package errs

import (
	"net/http"
)

type AppError struct {
	Code    int
	Message string
}

func (e AppError) Error() string {
	return e.Message
}

func NewNotFoundError(message string) error {
	return AppError{
		Code:    http.StatusNotFound,
		Message: message,
	}
}

func NewNotAcceptableError(message string) error {
	return AppError{
		Code:    http.StatusNotAcceptable,
		Message: message,
	}
}

func NewInternalServerError() error {
	return AppError{
		Code:    http.StatusInternalServerError,
		Message: "Unexpected error",
	}
}

func NewUnauthorizedError() error {
	return AppError{
		Code:    http.StatusUnauthorized,
		Message: "Unauthorized",
	}
}

func NewBadRequestError(message string) error {
	return AppError{
		Code:    http.StatusBadRequest,
		Message: message,
	}
}
