package handlers

import (
	"fmt"
	"net/http"
	"os"

	"github.com/BarisKaya09/YazBiForum/backend/storage/mongodb"
)

func Signup(w http.ResponseWriter, r *http.Request) {
	storage := mongodb.NewMongoDBStorage()
	if err := storage.Connect(os.Getenv("MONGODB_URI")); err != nil {
		fmt.Println("[ MongoDB ]: ", err)
		return
	}
	defer func() {
		if err := storage.Disconnect(); err != nil {
			fmt.Println("[ MongoDB ]: ", err)
			return
		}
	}()
}
func Signin(w http.ResponseWriter, r *http.Request) {

}
func Logout(w http.ResponseWriter, r *http.Request) {

}
func IsLoggedin(w http.ResponseWriter, r *http.Request) {

}
