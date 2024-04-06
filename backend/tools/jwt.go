package tools

import (
	"fmt"
	"os"
	"time"

	"github.com/BarisKaya09/YazBiForum/backend/types"
	"github.com/golang-jwt/jwt/v5"
)

func CreateToken(nickname string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"nickname": nickname,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func VerifyToken(tokenString string) error {
	var claims jwt.MapClaims
	token, err := jwt.ParseWithClaims(tokenString, &claims, func(token *jwt.Token) (any, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return "", fmt.Errorf("token error")
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return err
	}

	if !token.Valid {
		return types.CustomError{Message: "Invalid token!"}
	}
	return nil
}
