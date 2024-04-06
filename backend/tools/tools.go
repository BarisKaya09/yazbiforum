package tools

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/BarisKaya09/YazBiForum/backend/types"
)

func WriteJSON(w http.ResponseWriter, data any, status int) error {
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		slog.Error("write error", err)
		return err
	}
	return nil
}

func WriteReadError(w http.ResponseWriter) error {
	return WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: "Gövde okunurken bir hata oluştu.", Code: types.READ_ERROR}, http.StatusInternalServerError)
}

func WriteStorageConnectError(w http.ResponseWriter, connErr error) error {
	return WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: fmt.Sprintf("[ MongoDB Connection ]: %v", connErr), Code: types.DATABASE_ERROR}, http.StatusBadRequest)
}

func WriteStorageDisconnectError(w http.ResponseWriter, disconnErr error) error {
	return WriteJSON(w, types.UnsuccessResponse{Success: false, ErrorMessage: fmt.Sprintf("[ MongoDB Disconnection ]: %v", disconnErr), Code: types.DATABASE_ERROR}, http.StatusBadRequest)
}
