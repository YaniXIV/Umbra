package storage

import (
	"Umbra/backend/models"
	"crypto/sha256"
	"crypto/subtle"
	"fmt"
	"strconv"
	"sync"
)

// Current Storage devices in memory.

var (
	GroupStore  = make(map[int]*models.Group)
	nextGroupID = 0
	Auth        = make(map[string][]byte)
	UserStore   = make(map[string]*models.User)
	storeMutex  sync.Mutex
)

func SetUserVerification(userID string, groupID string, verified bool) bool {
	storeMutex.Lock()
	defer storeMutex.Unlock()

	user, ok := UserStore[userID]
	if !ok {
		return false
	}
	if user.Verified == nil {
		user.Verified = make(map[int]bool)
	}
	id, err := strconv.Atoi(groupID)
	if err != nil {
		return false
	}
	user.Verified[id] = verified
	return true
}

func ValidateVerification(userID string, groupID string) bool {
	storeMutex.Lock()
	defer storeMutex.Unlock()
	user, ok := UserStore[userID]
	if !ok {
		return false
	}
	id, err := strconv.Atoi(groupID)
	if err != nil {
		return false
	}

	if user.Verified[id] == true {
		return true
	}
	return false
}

// create a new group and store it.
func CreateGroup(c *models.Group) int {
	storeMutex.Lock()
	defer storeMutex.Unlock()
	//prevent race conditions
	groupID := nextGroupID
	nextGroupID++
	GroupStore[groupID] = c
	for _, i := range GroupStore {
		fmt.Println(i)
	}
	return groupID
}

func AuthenticateUser(c *models.LoginRequest) bool {
	hash := hashString(c.Password)
	if val, ok := Auth[c.Email]; ok && subtle.ConstantTimeCompare(val, hash) == 1 {
		return true
	} else {
		return false
	}
}

func StoreUser(c *models.SignUpRequest) bool {
	var usr models.LoginStorage
	usr.Email = c.Email
	usr.PassHash = hashString(c.Password)

	if _, ok := Auth[usr.Email]; ok {
		return false
	} else {
		Auth[usr.Email] = usr.PassHash
		return true
	}
}

func hashString(s string) []byte {
	h := sha256.New()
	h.Write([]byte(s))
	bs := h.Sum(nil)

	return bs
}

//Add a user to a group
/*
func AddUser(groupID int, user *models.User){
  user.Groups = append(user.Groups, groupID)

  group := GroupStore[groupID]
  group.Members = append(group.Members, user.UserID)

  UserStore[user.UserID] = user
}
*/
