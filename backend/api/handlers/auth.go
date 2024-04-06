package handlers

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/BarisKaya09/YazBiForum/backend/storage/mongodb"
	"github.com/BarisKaya09/YazBiForum/backend/tools"
	"github.com/BarisKaya09/YazBiForum/backend/types"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
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
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Gövde okunurken bir hata oluştu.", Code: types.READ_ERROR}, http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	if body.Name == "" || body.Surname == "" || body.DateOfBirth == "" || body.Nickname == "" || body.Email == "" || body.Password == "" {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Eksik kayıt bilgisi gönderildi!", Code: types.MISSING_CONTENT}, http.StatusBadRequest)
		return
	}

	if len(body.Password) <= 7 {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Lütfen şifrenizi 7 karakterden fazla girin!", Code: types.INVALID_PASSWORD_LENGTH}, http.StatusBadRequest)
		return
	}

	type info struct {
		Email *string `json:"email" validate:"email,omitempty" structs:"email,omitempty"`
	}
	validator := validator.New()
	info_ := &info{Email: &body.Email}
	err := validator.Struct(info_)
	if err != nil {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Geçersiz email formatı!", Code: types.INVALID_EMAIL_FORMAT}, http.StatusBadRequest)
		return
	}

	storage := mongodb.NewMongoDBStorage()
	if err := storage.Connect(os.Getenv("MONGODB_URI")); err != nil {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: fmt.Sprintf("[ MongoDB ]: %v", err), Code: types.DATABASE_ERROR}, http.StatusBadRequest)
		return
	}
	defer func() {
		if err := storage.Disconnect(); err != nil {
			tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: fmt.Sprintf("[ MongoDB ]: %v", err), Code: types.DATABASE_ERROR}, http.StatusBadRequest)
			return
		}
	}()

	// eğer kullanıcı adı ve email adresi alınmışsa hata döndür
	var result types.User
	if err := storage.FindOne(bson.D{{"nickname", body.Nickname}}, &result); err == nil {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Bu kullanıcı adı kayıtlı!", Code: types.USER_EXIST}, http.StatusBadRequest)
		return
	}
	if err := storage.FindOne(bson.D{{"email", body.Email}}, &result); err == nil {
		w.WriteHeader(http.StatusBadRequest)
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Bu email adresi kayıtlı!", Code: types.USER_EXIST}, http.StatusBadRequest)
		return
	}

	hashedPassword, err := tools.HashPassword([]byte(body.Password), 14)
	if err != nil {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: fmt.Sprintf("[ bcrypt ]: %v", err), Code: types.ANY_ERROR}, http.StatusInternalServerError)
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
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Kullanıcı eklenirken bir hata oluştu", Code: types.DATABASE_ERROR}, http.StatusInternalServerError)
		return
	}
	slog.Info("Kullanıcı başarılı bir şekilde eklendi.")
	tools.WriteJSON(w, types.Response{Success: true, Message: "Kullanıcı başarılı bir şekilde eklendi."}, http.StatusOK)
}

type LoginBody struct {
	Nickname string `json:"nickname"`
	Password string `json:"password"`
}

func Signin(w http.ResponseWriter, r *http.Request) {
	var body LoginBody
	// read body
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Gövde okunurken bir hata oluştu.", Code: types.READ_ERROR}, http.StatusInternalServerError)
		return
	}

	if body.Nickname == "" || body.Password == "" {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Eksik giriş bilgisi gönderildi!!", Code: types.MISSING_CONTENT}, http.StatusBadRequest)
		return
	}

	storage := mongodb.NewMongoDBStorage()
	if err := storage.Connect(os.Getenv("MONGODB_URI")); err != nil {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: fmt.Sprintf("[ MongoDB ]: %v", err), Code: types.DATABASE_ERROR}, http.StatusBadRequest)
		return
	}

	defer func() {
		if err := storage.Disconnect(); err != nil {
			tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: fmt.Sprintf("[ MongoDB ]: %v", err), Code: types.DATABASE_ERROR}, http.StatusBadRequest)
			return
		}
	}()

	// kullanıcı bulunmuyorsa hata döndür
	var result types.User
	if err := storage.FindOne(bson.D{{"nickname", body.Nickname}}, &result); err != nil {
		if err == mongo.ErrNoDocuments {
			tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Kullanıcı mevcut değil!", Code: types.USER_NOT_EXIST}, http.StatusUnauthorized)
			return
		}
	}

	// hata varsa şifre uyuşmamış demektir
	if err := tools.CompareHashedPassword([]byte(result.Password), []byte(body.Password)); err != nil {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Hatalı şifre girildi!", Code: types.WRONG_PASSWORD}, http.StatusUnauthorized)
		return
	}

	token, err := tools.CreateToken(body.Nickname)
	if err != nil {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: fmt.Sprintf("[ JWT ]: %v", err), Code: types.JWT_ERROR}, http.StatusUnauthorized)
		return
	}

	// set cookie
	tokenCookie := &http.Cookie{
		Name:    "token",
		Value:   token,
		Expires: time.Now().Add(time.Hour * 24).UTC(),
	}
	nicknameCookie := &http.Cookie{
		Name:    "nickname",
		Value:   body.Nickname,
		Expires: time.Now().Add(time.Hour * 24).UTC(),
	}
	http.SetCookie(w, tokenCookie)
	http.SetCookie(w, nicknameCookie)
	tools.WriteJSON(w, types.Response{Success: true, Message: "Başarılı bir şekilde giriş yapıldı."}, http.StatusOK)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	tokenCookie := &http.Cookie{
		Name:    "token",
		Value:   "",
		Expires: time.Unix(0, 0),
	}
	nicknameCookie := &http.Cookie{
		Name:    "nickname",
		Value:   "",
		Expires: time.Unix(0, 0),
	}
	http.SetCookie(w, tokenCookie)
	http.SetCookie(w, nicknameCookie)
	tools.WriteJSON(w, types.Response{Success: true, Message: "Başarılı bir şekilde çıkış yapıldı."}, http.StatusOK)
}
func IsLoggedin(w http.ResponseWriter, r *http.Request) {

}
