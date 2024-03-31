package api

import (
	"fmt"
	"net/http"
)

type Server struct {
	listenaddr string
}

func NewServer(listenaddr string) *Server {
	return &Server{listenaddr: listenaddr}
}

func (s *Server) Start() error {
	fmt.Printf("Server %+v portunda başlatıldı: http://localhost:%v", s.listenaddr, s.listenaddr)
	mux := http.NewServeMux()
	s.allRoutes()
	if err := http.ListenAndServe(s.listenaddr, mux); err != nil {
		return fmt.Errorf("[ Starting Error ]: %v", err)
	}
	return nil
}

func (s *Server) allRoutes() {
	s.authRoutes()
	s.forumRoutes()
}

func (s *Server) authRoutes() {
	// mux.HandleFunc("GET /hello", handler.hello)
}

func (s *Server) forumRoutes() {
	// mux.HandleFunc("GET /hello", handler.hello)
}
