package tools

import (
	"encoding/json"
	"net/http"
)

func WriteJSON(w http.ResponseWriter, data any) error {
	return json.NewEncoder(w).Encode(data)
}
