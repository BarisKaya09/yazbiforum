package tools

import "golang.org/x/crypto/bcrypt"

func HashPassword(password []byte, cost int) ([]byte, error) {
	hashed, err := bcrypt.GenerateFromPassword(password, cost)
	if err != nil {
		return []byte(""), err
	}
	return hashed, nil
}

func CompareHashedPassword(hashedPassword, password []byte) error {
	// eğer hata varsa hashlenmiş şifre ve gönderilen şifre uyuşmamış demektir.
	if err := bcrypt.CompareHashAndPassword(hashedPassword, password); err != nil {
		return err
	}
	return nil
}
