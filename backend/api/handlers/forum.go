package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/BarisKaya09/YazBiForum/backend/data"
	"github.com/BarisKaya09/YazBiForum/backend/storage/mongodb"
	"github.com/BarisKaya09/YazBiForum/backend/tools"
	"github.com/BarisKaya09/YazBiForum/backend/types"
	gonanoid "github.com/matoous/go-nanoid/v2"
	"go.mongodb.org/mongo-driver/bson"
)

type CreateForumBody struct {
	Tag     []types.Tags    `json:"tag"`
	Title   string          `json:"title"`
	Content string          `json:"content"`
	Type_   types.ForumType `json:"type_"`
}

func CreateForum(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("content-type", "aplication/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Add("Accept", "application/json")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	var body CreateForumBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		tools.WriteReadError(w)
		return
	}

	if len(body.Tag) == 0 || body.Title == "" || body.Content == "" || body.Type_ == "" {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Eksik forum bilgisi gönderildi!", Code: types.MISSING_CONTENT}, http.StatusBadRequest)
		return
	}

	if body.Type_ != types.Discussion && body.Type_ != types.Information && body.Type_ != types.Question {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Geçersiz forum tipi gönderildi!", Code: types.INVALID_FORUM_TYPE}, http.StatusBadRequest)
		return
	}

	if len(body.Tag) > 3 {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Üçten fazla tag olamaz!", Code: types.INVALID_FORUM_TAG}, http.StatusBadRequest)
		return
	}

	for _, btag := range body.Tag {
		var founded int = 0
		for _, dtag := range data.Tags {
			if dtag == string(btag) {
				founded++
				break
			} else {
				continue
			}
		}
		if founded == 0 {
			// geçersiz tag
			tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Geçersiz forum tagı!", Code: types.INVALID_FORUM_TAG}, http.StatusBadRequest)
			return
		}
	}

	nickname, err := r.Cookie("nickname")
	if err != nil {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Çerezlerde 'nickname' bulunamadı!", Code: types.UNAUTHORIZED}, http.StatusUnauthorized)
		return
	}
	year, month, day := time.Now().Date()
	id, err := gonanoid.New(30)
	if err != nil {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: fmt.Sprintf("[ gonanoid ]: %v", err), Code: types.ANY_ERROR}, http.StatusInternalServerError)
		return
	}

	// türkçe karakterleride alabilmek için.
	nicknameValue, _ := url.QueryUnescape(nickname.Value)
	newForum := types.Forum{
		Id:          id,
		Author:      nicknameValue,
		Tag:         body.Tag,
		Title:       body.Title,
		Content:     body.Content,
		Type_:       body.Type_,
		ReleaseDate: fmt.Sprintf("%v %v %v", year, month, day),
		LastUpdate:  "Son güncelleme yok",
		Comments:    []types.Comment{},
		Likes:       types.Likes{},
	}

	var user types.User
	storage := mongodb.NewMongoDBStorage()
	if err := storage.Connect(os.Getenv("MONGODB_URI")); err != nil {
		tools.WriteStorageConnectError(w, err)
		return
	}

	defer func() {
		if err := storage.Disconnect(); err != nil {
			tools.WriteStorageDisconnectError(w, err)
			return
		}
	}()

	if err := storage.FindOne(bson.D{{Key: "nickname", Value: nicknameValue}}, &user); err != nil {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Kullanıcı bulunamadı!", Code: types.USER_NOT_EXIST}, http.StatusUnauthorized)
		return
	}

	if err := storage.InsertForum(&user, newForum); err != nil {
		tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Forum eklenirken beklenmedik bir hata oluştu!", Code: types.ANY_ERROR}, http.StatusInternalServerError)
		return
	}
	tools.WriteJSON(w, types.Response{Success: true, Message: "Forum başarılı bir şekilde eklendi1"}, http.StatusOK)
}

func LikedForum(w http.ResponseWriter, r *http.Request) {

}
func DeleteForum(w http.ResponseWriter, r *http.Request) {

}
func CreateComment(w http.ResponseWriter, r *http.Request) {

}
func UpdateForum(w http.ResponseWriter, r *http.Request) {

}
func GetTags(w http.ResponseWriter, r *http.Request) {

}
