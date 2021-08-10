package repository

import (
	"io"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name      string             `bson:"name,omitempty" json:"name,omitempty"`
	Lastname  string             `bson:"lastname,omitempty" json:"lastname,omitempty"`
	Email     string             `bson:"email,omitempty" json:"email,omitempty"`
	Password  string             `bson:"password,omitempty" json:"password,omitempty"`
	CreatedAt time.Time          `bson:"created_at,omitempty" json:"created_at,omitempty"`
	UpdatedAt time.Time          `bson:"updated_at,omitempty" json:"updated_at,omitempty"`
	Level     string             `bson:"level,omitempty" json:"level,omitempty"`
	Image     Image              `bson:"image,omitempty" json:"image,omitempty"`
}

type Image struct {
	PublicID string `bson:"publicId,omitempty"`
	ImageUrl string `bson:"ImageUrl,omitempty" json:"ImageUrl,omitempty"`
}

type UserRepository interface {
	UploadImage(image io.Reader) (*Image, error)
	DeleteImage(image Image) error

	GetUserByEmail(User) (*User, error)
	CreateUser(User) (*User, error)

	GetAllUsers(limit, skip int) (*[]User, error)
	GetfilterUser(query string, limit, skip int) (*[]User, error)
	GetById(id primitive.ObjectID) (*User, error)

	UpdateUser(User) error
	DeleteUser(id primitive.ObjectID) error
}
