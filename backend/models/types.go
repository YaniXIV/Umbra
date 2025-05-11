package models


type UserData struct{
  id string
  email string

}
type User struct{
    ID    string `json:"id"`
    Email string `json:"email"`
    Name  string `json:"name"`
}

type Group struct{
  Name string `json:"name"`
  Location Position `json:"location"`
  Radius int `json:"radius"`
  Members []string `json:"members"`
}



type Position struct{
    Latitude string `json:"latitude"`
    Longitude string `json:"longitude"`
}


//Api Response types
type ApiResponse struct{
  Data  *User  `json:"data"`
  Error string `json:"error,omitempty"`
}
type SignUpResponse struct{
  Valid bool `json:"valid"`
}
type LoginResponse struct{
  Valid bool `json:"valid"`
}

//Api Request types
type LoginRequest struct{
  Email string `json:"email"`
  Password string `json:"password"`
}
type SignUpRequest struct{
  Email string `json:"email"`
  Password string `json:"password"`
  Name string `json:"name"`
}
type CreateGroupRequest struct{
  GroupId string `json:"groupId"`
  Latitude int `json:"latitude"`
}

//Storage
type LoginStorage struct{
  Email string 
  PassHash []byte
}
