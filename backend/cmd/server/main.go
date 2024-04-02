package main

import (
	"log"

	"github.com/BarisKaya09/YazBiForum/backend/api"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}
	server := api.NewServer(":5000")
	if err := server.Start(); err != nil {
		log.Fatal(err)
	}
}
