package handlers

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"github.com/BarisKaya09/YazBiForum/backend/storage/mongodb"
	"github.com/BarisKaya09/YazBiForum/backend/tools"
	"github.com/BarisKaya09/YazBiForum/backend/types"
	"github.com/go-playground/validator/v10"
)

type RegisterBody struct {
	Name        string `json:"name"`
	Surname     string `json:"surname"`
	DateOfBirth string `json:"dateOfBirth"`
	Nickname    string `json:"nickname"`
	Email       string `json:"email"`
	Password    string `json:"password"`
}

func Signup(w http.ResponseWriter, r *http.Request) {
	var body RegisterBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Göve okunurken bir hata oluştu.", Code: types.READ_ERROR})
		return
	}
	defer r.Body.Close()

	if body.Name == "" || body.Surname == "" || body.DateOfBirth == "" || body.Nickname == "" || body.Email == "" || body.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Eksik kayıt bilgisi gönderildi!", Code: types.MISSING_CONTENT})
		return
	}

	if len(body.Password) <= 7 {
		w.WriteHeader(http.StatusBadRequest)
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Lütfen şifrenizi 7 karakterden fazla girin!", Code: types.INVALID_PASSWORD_LENGTH})
		return
	}

	type info struct {
		Email *string `json:"email" validate:"email,omitempty" structs:"email,omitempty"`
	}
	validator := validator.New()
	info_ := &info{Email: &body.Email}
	err := validator.Struct(info_)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Geçersiz email formatı!", Code: types.INVALID_EMAIL_FORMAT})
		return
	}

	storage := mongodb.NewMongoDBStorage()
	if err := storage.Connect(os.Getenv("MONGODB_URI")); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: fmt.Sprintf("[ MongoDB ]: %v", err), Code: types.DATABASE_ERROR})
		return
	}
	defer func() {
		if err := storage.Disconnect(); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: fmt.Sprintf("[ MongoDB ]: %v", err), Code: types.DATABASE_ERROR})
			return
		}
	}()

	hashedPassword, err := tools.HashPassword([]byte(body.Password), 14)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: fmt.Sprintf("[ bcrypt ]: %v", err), Code: types.ANY_ERROR})
		return
	}
	user := types.User{
		Name:         body.Name,
		Surname:      body.Surname,
		DateOfBirth:  body.DateOfBirth,
		Nickname:     body.Nickname,
		Email:        body.Email,
		Password:     string(hashedPassword),
		Forums:       []types.Forum{},
		Interactions: types.Interactions{LikedForums: []types.LikedForums{}, Commented: []types.Commented{}},
	}

	if err := storage.InsertUser(user); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Kullanıcı eklenirken bir hata oluştu", Code: types.DATABASE_ERROR})
		return
	}
	slog.Info("Kullanıcı başarılı bir şekilde eklendi.")
	tools.WriteJSON(w, types.Response{Success: true, Message: "Kullanıcı başarılı bir şekilde eklendi."})
}
func Signin(w http.ResponseWriter, r *http.Request) {
	
}
func Logout(w http.ResponseWriter, r *http.Request) {

}
func IsLoggedin(w http.ResponseWriter, r *http.Request) {

}
