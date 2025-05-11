package models

type UserData struct {
	id    string
	email string
}
type User struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

type Location struct {
	Latitude  string `json:"latitude"`
	Longitude string `json:"longitude"`
}

// Api Response types
type ApiResponse struct {
	Valid bool   `json:"valid"`
	Error string `json:"error,omitempty"`
}
type SignUpResponse struct {
	Valid bool `json:"valid"`
}
type LoginResponse struct {
	Valid bool `json:"valid"`
}

// Api Request types
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
type SignUpRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}
type Group struct {
	Location Location `json:"location"`
	Members  []string `json:"members"`
	Name     string   `json:"name"`
	Radius   int      `json:"radius"`
}

// Storage
type LoginStorage struct {
	Email    string
	PassHash []byte
}
