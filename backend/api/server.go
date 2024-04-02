package api

import (
	"fmt"
	"net/http"

	"github.com/BarisKaya09/YazBiForum/backend/api/handlers"
	"github.com/fatih/color"
)

type Server struct {
	listenaddr string
	mux        *http.ServeMux
}

func NewServer(listenaddr string) *Server {
	return &Server{listenaddr: listenaddr}
}

func (s *Server) Start() error {
	color := color.New(color.BgRed).Add(color.FgHiWhite)
	color.Printf("Server %+v portunda başlatıldı: http://localhost:%v\n", s.listenaddr, s.listenaddr)
	mux := http.NewServeMux()
	s.mux = mux
	s.allRoutes()
	if err := http.ListenAndServe(s.listenaddr, mux); err != nil {
		return fmt.Errorf(color.Sprintf("[ Starting Error ]: %v\n", err))
	}
	return nil
}

func (s *Server) allRoutes() {
	s.authRoutes()
	s.forumRoutes()
	s.accountRoutes()
}

func (s *Server) authRoutes() {
	s.mux.HandleFunc("POST /auth/signup", handlers.Signup)
	s.mux.HandleFunc("POST /auth/signin", handlers.Signin)
	s.mux.HandleFunc("POST /auth/logout", handlers.Logout)
	s.mux.HandleFunc("GET /auth/isLoggedin", handlers.IsLoggedin)
}

func (s *Server) forumRoutes() {
	// mux.HandleFunc("GET /hello", handler.hello)
}

func (s *Server) accountRoutes() {
	// mux.HandleFunc("GET /hello", handler.hello)
}
