package tools

import (
	"encoding/json"
	"net/http"
)

func WriteJSON(w http.ResponseWriter, data any, status int) error {
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(data)
}
