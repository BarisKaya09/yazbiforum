package mongodb

import (
	"context"

	"github.com/BarisKaya09/YazBiForum/backend/types"
	"github.com/fatih/color"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Storage interface {
	Connect(uri string) error
	Disconnect() error
	InsertUser(user types.User) error
	InsertForum(user *types.User, forum types.Forum) error
}

type MongoDBStorage struct {
	client *mongo.Client
}

func NewMongoDBStorage() *MongoDBStorage {
	return &MongoDBStorage{}
}

func (ms *MongoDBStorage) Connect(uri string) error {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		return err
	}
	color := color.New(color.BgCyan).Add(color.FgHiBlack)
	color.Println("--- MongoDB connected. ---")
	ms.client = client
	return nil
}

func (ms *MongoDBStorage) Disconnect() error {
	if err := ms.client.Disconnect(context.TODO()); err != nil {
		return err
	}
	color := color.New(color.BgHiMagenta).Add(color.FgHiBlack)
	color.Println("--- MongoDB disconnected. ---")
	return nil
}

func (ms *MongoDBStorage) InsertUser(user types.User) error {
	coll := ms.client.Database("yazbiforum").Collection("users")
	if _, err := coll.InsertOne(context.TODO(), user); err != nil {
		return err
	}
	return nil
}

func (ms *MongoDBStorage) FindOne(filter any, result *types.User) error {
	coll := ms.client.Database("yazbiforum").Collection("users")
	if err := coll.FindOne(context.TODO(), filter).Decode(&result); err != nil {
		return err
	}
	return nil
}

func (ms *MongoDBStorage) InsertForum(user *types.User, forum types.Forum) error {
	// user zaten geliyor o yüzden filter parametresi almaya gerek yok
	coll := ms.client.Database("yazbiforum").Collection("users")
	user.Forums = append(user.Forums, forum)
	filter := bson.D{{Key: "nickname", Value: user.Nickname}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "forums", Value: user.Forums}}}}
	if _, err := coll.UpdateOne(context.TODO(), filter, update); err != nil {
		return err
	}
	return nil
}
