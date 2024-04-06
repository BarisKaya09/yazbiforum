package api

import (
	"fmt"
	"net/http"

	"github.com/BarisKaya09/YazBiForum/backend/api/handlers"
	"github.com/BarisKaya09/YazBiForum/backend/api/middlewares"
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
	s.mux.HandleFunc("POST /api/auth/signup", handlers.Signup)
	s.mux.HandleFunc("POST /api/auth/signin", handlers.Signin)
	s.mux.HandleFunc("POST /api/auth/logout", middlewares.RequireAuth(handlers.Logout))
	s.mux.HandleFunc("GET /api/auth/isLoggedin", middlewares.RequireAuth(handlers.IsLoggedin))
}

func (s *Server) forumRoutes() {
	s.mux.HandleFunc("POST /api/auth/createForum", middlewares.RequireAuth(handlers.CreateForum))
	s.mux.HandleFunc("POST /api/forum/likeForum/:/:_id", middlewares.RequireAuth(handlers.LikedForum))
	s.mux.HandleFunc("POST /api/forum/deleteForum/:", middlewares.RequireAuth(handlers.DeleteForum))
	s.mux.HandleFunc("POST /api/forum/createComment/:/:_id", middlewares.RequireAuth(handlers.CreateComment))
	s.mux.HandleFunc("POST /api/forum/updateForum/:", middlewares.RequireAuth(handlers.UpdateForum))
	s.mux.HandleFunc("GET /api/forum/getTags", middlewares.RequireAuth(handlers.GetTags))
}

func (s *Server) accountRoutes() {
	// mux.HandleFunc("GET /hello", handler.hello)
}
