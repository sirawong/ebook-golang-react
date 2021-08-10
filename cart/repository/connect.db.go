package repository

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/spf13/viper"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectDB() *mongo.Client {

	dsn := fmt.Sprintf("mongodb+srv://%v", viper.GetString("db.db_uri"))

	clientOptions := options.Client().
		ApplyURI(dsn)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		panic(err)
	}

	log.Println("Connected to database")
	return client
}
