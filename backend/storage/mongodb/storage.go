package mongodb

import (
	"context"

	"github.com/fatih/color"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

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
	color.Println("MongoDB connected.")
	ms.client = client
	return nil
}

func (ms *MongoDBStorage) Disconnect() error {
	if err := ms.client.Disconnect(context.TODO()); err != nil {
		return err
	}
	color := color.New(color.BgCyan).Add(color.FgHiBlack)
	color.Println("MongoDB disconnected.")
	return nil
}
