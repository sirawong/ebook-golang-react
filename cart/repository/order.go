package repository

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Cart struct {
	ID         primitive.ObjectID `bson:"_id" json:"_id"`
	Items      []Item             `bson:"items" json:"items"`
	TotalItem  int32              `bson:"totalItem" json:"totalItem"`
	ValueTotal float64            `bson:"valueTotal" json:"valueTotal"`
	CreatedAt  time.Time          `bson:"createdAt"`
}

type Item struct {
	Id         string   `bson:"id,omitempty" json:"id,omitempty"`
	Title      string   `bson:"title,omitempty" json:"title,omitempty"`
	Price      float64  `bson:"price,omitempty" json:"price,omitempty"`
	Imageslink []string `bson:"imageslink,omitempty" json:"imageslink,omitempty"`
	Quantity   int32    `bson:"quantity,omitempty" json:"quantity,omitempty"`
}

type CartRepository interface {
	NewCart(userId string, cart Cart) error
	GetOneAndUpdate(userId string, cart Cart) error
	GetCart(userId string) (*Cart, error)
}
