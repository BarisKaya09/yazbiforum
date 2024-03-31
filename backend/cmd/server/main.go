package main

import "github.com/BarisKaya09/YazBiForum/backend/api"

func main() {
	server := api.NewServer(":5000")
	server.Start()
}
