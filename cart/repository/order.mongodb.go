package repository

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func NewCartRepository(db *mongo.Client) CartRepository {
	return cartRepositoryDB{client: db}
}

type cartRepositoryDB struct {
	client *mongo.Client
}

func initCollection(r cartRepositoryDB, col string) (context.Context, context.CancelFunc, *mongo.Collection) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	cartCollection := r.client.Database("book_store").Collection(col)
	return ctx, cancel, cartCollection
}

func (r cartRepositoryDB) NewCart(userId string, cart Cart) error {
	ctx, cannel, cartCollection := initCollection(r, "carts")
	defer cannel()

	cart.CreatedAt = time.Now()
	oid, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return err
	}
	cart.ID = oid

	_, err = cartCollection.InsertOne(ctx, cart)
	if err != nil {
		return err
	}

	return nil
}

func (r cartRepositoryDB) GetOneAndUpdate(userId string, cart Cart) error {
	ctx, cannel, cartCollection := initCollection(r, "carts")
	defer cannel()

	cart.CreatedAt = time.Now()
	oid, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return err
	}
	cart.ID = oid

	cartReplace := cartCollection.FindOneAndReplace(ctx, bson.M{"_id": oid}, cart)
	if cartReplace.Err() != nil {
		return cartReplace.Err()
	}

	return nil
}

func (r cartRepositoryDB) GetCart(userId string) (*Cart, error) {
	ctx, cannel, cartCollection := initCollection(r, "carts")
	defer cannel()
	oid, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return nil, err
	}
	cartResult := cartCollection.FindOne(ctx, bson.M{"_id": oid})
	if cartResult.Err() != nil {
		return nil, cartResult.Err()
	}

	var cart Cart
	err = cartResult.Decode(&cart)
	if err != nil {
		return nil, err
	}

	return &cart, nil
}
