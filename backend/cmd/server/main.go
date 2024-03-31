package main

import (
	"log"

	"github.com/BarisKaya09/YazBiForum/backend/api"
)

func main() {
	server := api.NewServer(":5000")
	if err := server.Start(); err != nil {
		log.Fatal(err)
	}
}
