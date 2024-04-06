package middlewares

import (
	"net/http"

	"github.com/BarisKaya09/YazBiForum/backend/tools"
	"github.com/BarisKaya09/YazBiForum/backend/types"
)

func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("content-type", "aplication/json")
		// w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Add("Accept", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8080")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		token, err := r.Cookie("token")
		if err != nil {
			tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Giriş yapmalısınız!", Code: types.UNAUTHORIZED}, http.StatusUnauthorized)
			return
		}
		if err := tools.VerifyToken(token.Value); err != nil {
			tools.WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Token doğrulanamadı!", Code: types.JWT_ERROR}, http.StatusUnauthorized)
			return
		}
		next(w, r)
	})
}
