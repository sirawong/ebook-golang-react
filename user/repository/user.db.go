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

func NewUserRepository(db *mongo.Client, cld *cloudinary.Cloudinary) UserRepository {
	return userRepositoryDB{client: db, cld: cld}
}

type userRepositoryDB struct {
	client *mongo.Client
	cld    *cloudinary.Cloudinary
}

func initCollection(r userRepositoryDB, col string) (context.Context, context.CancelFunc, *mongo.Collection) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	bookCollection := r.client.Database("book_store").Collection(col)
	return ctx, cancel, bookCollection
}

func (r userRepositoryDB) GetUserByEmail(user User) (*User, error) {
	ctx, cannel, userCollection := initCollection(r, "users")
	defer cannel()

	var u User
	err := userCollection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&u)
	if err != nil {
		return nil, err
	}

	return &User{
		ID:       u.ID,
		Password: u.Password,
		Level:    u.Level,
		Image:    u.Image,
	}, nil
}

func (r userRepositoryDB) CreateUser(user User) (*User, error) {
	ctx, cannel, userCollection := initCollection(r, "users")
	defer cannel()

	var u User
	err := userCollection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&u)
	if u.Email != "" {
		return nil, errors.New("User already exists")
	}

	userResult, err := userCollection.InsertOne(ctx, user)
	if err != nil {
		return nil, err
	}
	return &User{ID: userResult.InsertedID.(primitive.ObjectID)}, nil
}

func (r userRepositoryDB) GetAllUsers(limit, skip int) (*[]User, error) {
	ctx, cannel, userCollection := initCollection(r, "users")
	defer cannel()

	opt := options.Find()
	opt.SetProjection(bson.M{"password": 0})
	opt.SetSkip(int64(limit * skip))
	opt.SetLimit(int64(limit))

	cursor, err := userCollection.Find(ctx, bson.M{}, opt)
	defer cursor.Close(ctx)
	if err != nil {
		return nil, err
	}

	var user []User
	if err = cursor.All(ctx, &user); err != nil {
		return nil, err
	}

	return &user, nil
}

func (r userRepositoryDB) GetfilterUser(query string, limit, skip int) (*[]User, error) {
	ctx, cannel, userCollection := initCollection(r, "users")
	defer cannel()

	var cursor *mongo.Cursor
	var err error

	searchStage := bson.D{{"$search", bson.D{{"text", bson.D{{"query", query}, {"path", bson.A{"name", "lastname", "email"}}}}}}}
	// seleteState := bson.D{{"$project", bson.D{{"password", 0}}}}
	pipeline := bson.D{{"$facet", bson.D{{"totalCount", bson.A{bson.M{"$count": "count"}}}, {"data", bson.A{bson.M{"$skip": skip * limit}, bson.M{"$limit": limit}}}}}}

	if query == "" {
		cursor, err = userCollection.Aggregate(ctx, mongo.Pipeline{pipeline})
	} else {
		cursor, err = userCollection.Aggregate(ctx, mongo.Pipeline{searchStage, pipeline})
	}
	if err != nil {
		return nil, err
	}

	var users []User
	err = cursor.All(ctx, &users)
	if err != nil {
		return nil, err
	}

	return &users, nil
}

func (r userRepositoryDB) GetById(id primitive.ObjectID) (*User, error) {
	ctx, cannel, userCollection := initCollection(r, "users")
	defer cannel()

	var user User
	if err := userCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&user); err != nil {
		return nil, err
	}

	return &user, nil
}

func (r userRepositoryDB) UpdateUser(user User) error {
	ctx, cannel, userCollection := initCollection(r, "users")
	defer cannel()

	_, err := userCollection.UpdateOne(
		ctx,
		bson.M{"_id": user.ID},
		bson.D{
			{"$set", user},
		},
	)
	if err != nil {
		return err
	}

	return nil
}

func (r userRepositoryDB) DeleteUser(id primitive.ObjectID) error {
	ctx, cannel, userCollection := initCollection(r, "users")
	defer cannel()

	_, err := userCollection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return err
	}
	return nil
}
