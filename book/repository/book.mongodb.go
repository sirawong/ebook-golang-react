package repository

import (
	"context"
	"errors"
	"time"

	"github.com/cloudinary/cloudinary-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func NewBookRepository(db *mongo.Client, cld *cloudinary.Cloudinary) BookRepository {
	return bookRepositoryDB{client: db, cld: cld}
}

type bookRepositoryDB struct {
	client *mongo.Client
	cld    *cloudinary.Cloudinary
}

func initCollection(r bookRepositoryDB, col string) (context.Context, context.CancelFunc, *mongo.Collection) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	bookCollection := r.client.Database("book_store").Collection(col)
	return ctx, cancel, bookCollection
}

func (r bookRepositoryDB) CheckBook(bookTitle string) error {
	ctx, cannel, bookCollection := initCollection(r, "books")
	defer cannel()

	check := bookCollection.FindOne(ctx, bson.M{"title": bookTitle})
	if check.Err() == mongo.ErrNoDocuments {
		return nil
	}
	return errors.New("Book already exists")
}

func (r bookRepositoryDB) CreateNewBook(book Book) (string, error) {
	ctx, cannel, bookCollection := initCollection(r, "books")
	defer cannel()

	book.CreatedAt = time.Now()
	result, err := bookCollection.InsertOne(ctx, book)
	if err != nil {
		return "", err
	}
	return result.InsertedID.(primitive.ObjectID).Hex(), nil
}

func (r bookRepositoryDB) GetAllBooks(limit, sort, skip int) (*[]Book, error) {
	ctx, cannel, bookCollection := initCollection(r, "books")
	defer cannel()

	var orders *mongo.Cursor
	var err error
	findoptions := options.Find()
	findoptions.SetSort(bson.D{{"rating", sort}})
	findoptions.SetSkip(int64(limit * skip))
	findoptions.SetLimit(int64(limit))

	orders, err = bookCollection.Find(ctx, bson.D{}, findoptions)
	if err != nil {
		return nil, err
	}

	var book []Book
	err = orders.All(ctx, &book)
	if err != nil {
		return nil, err
	}

	return &book, nil
}

func (r bookRepositoryDB) GetfilterBooks(query string, sortRating, sortPrice, limit, skip int, gtPrice, ltPrice, gtRating float64) (*[]BookResponse, error) {
	ctx, cannel, bookCollection := initCollection(r, "books")
	defer cannel()

	var orders *mongo.Cursor
	var err error

	searchStage := bson.D{{"$search",
		bson.D{{"compound",
			bson.D{{"should",
				bson.A{
					bson.D{{"text",
						bson.D{{"query", query}, {"path", "title"}, {"score", bson.D{{"boost", bson.D{{"value", 5}}}}}}}},
					bson.D{{"text",
						bson.D{{"query", query}, {"path", bson.A{"genres", "author", "description", "characters"}}}}}}}}}}}}

	filterPriceStage := bson.D{{"$match", bson.M{"$and": bson.A{bson.M{"price": bson.M{"$gte": gtPrice}}, bson.M{"price": bson.M{"$lte": ltPrice}}}}}}
	filterRatingStage := bson.D{{"$match", bson.M{"rating": bson.M{"$gte": gtRating}}}}

	var sortStage primitive.D
	if sortRating == 0 && sortPrice != 0 {
		sortStage = bson.D{{"$sort", bson.D{{"price", sortPrice}}}}
	}
	if sortRating != 0 && sortPrice == 0 {
		sortStage = bson.D{{"$sort", bson.D{{"rating", sortRating}}}}
	}

	pipeline := bson.D{{"$facet", bson.D{{"totalCount", bson.A{bson.M{"$count": "count"}}}, {"data", bson.A{bson.M{"$skip": skip * limit}, bson.M{"$limit": limit}}}}}}

	if query == "" {
		orders, err = bookCollection.Aggregate(ctx, mongo.Pipeline{sortStage, filterPriceStage, filterRatingStage, pipeline})
	} else if sortRating != 0 || sortPrice != 0 {
		orders, err = bookCollection.Aggregate(ctx, mongo.Pipeline{searchStage, sortStage, filterPriceStage, filterRatingStage, pipeline})
	} else {
		orders, err = bookCollection.Aggregate(ctx, mongo.Pipeline{searchStage, filterPriceStage, filterRatingStage, pipeline})
	}

	if err != nil {
		return nil, err
	}

	var book []BookResponse

	err = orders.All(ctx, &book)
	if err != nil {
		return nil, err
	}

	return &book, nil
}

func (r bookRepositoryDB) GetBook(id string) (*Book, error) {
	ctx, cannel, bookCollection := initCollection(r, "books")
	defer cannel()
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	var book Book
	if err := bookCollection.FindOne(ctx, bson.M{"_id": oid}).Decode(&book); err != nil {
		return nil, err
	}
	return &book, nil
}

func (r bookRepositoryDB) UpdateBook(id string, updateBook Book) error {
	ctx, cannel, bookCollection := initCollection(r, "books")
	defer cannel()
	updateBook.UpdatedAt = time.Now()
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = bookCollection.UpdateOne(ctx, bson.M{"_id": oid}, bson.M{"$set": updateBook})
	if err != nil {
		return err
	}

	return nil
}

func (r bookRepositoryDB) DeleteBook(id string) error {
	ctx, cannel, bookCollection := initCollection(r, "books")
	defer cannel()
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = bookCollection.DeleteOne(ctx, bson.M{"_id": oid})
	if err != nil {
		return err
	}

	return nil
}
