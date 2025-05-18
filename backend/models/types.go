package models

type UserData struct {
	id    string
	email string
}
type User struct {
	UserId   string       `json:"userId"`
	Email    string       `json:"email"`
	Verified map[int]bool `json:"verified"`
}
type ValidateRequest struct {
	UserId  string `json:"userId"`
	GroupId string `json:"groupId"`
}

type ProofRequest struct {
	PrivateLocation Location `json:"privateLocation"`
	PublicLocation  Location `json:"publicLocation"`
	Radius          string   `json:"radius"`
	GroupId         string   `json:"groupId"`
	UserId          string   `json:"userId"`
}

type Location struct {
	Latitude  string `json:"latitude"`
	Longitude string `json:"longitude"`
}

// Api Response types
type ApiResponse struct {
	Valid bool                   `json:"valid"`
	Error string                 `json:"error,omitempty"`
	Data  map[string]interface{} `json:"data,omitempty"`
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
	Location    Location `json:"location"`
	Members     []string `json:"members"`
	GroupID     string   `json:"groupID"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Radius      int      `json:"radius"`
}

// Storage
type LoginStorage struct {
	Email    string
	PassHash []byte
}
