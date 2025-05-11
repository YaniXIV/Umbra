package storage 

import(
  "Umbra/backend/models"
  "crypto/sha256"
  "crypto/subtle"
)

//Current Storage devices in memory.
var GroupStore = make(map[int]*models.Group)
var UserStore = make(map[string]*models.User)
var nextGroupID = 0
var Auth = make(map[string][]byte) 


//create a new group and store it.
func CreateGroup(c *models.Group)int{
  groupID := nextGroupID
  nextGroupID++

  GroupStore[groupID] = c 

  return groupID
}

func AuthenticateUser(c *models.LoginRequest)bool{
  hash := hashString(c.Password)
  if val,ok := Auth[c.Email]; ok && subtle.ConstantTimeCompare(val,hash)==1{
    return true
  }else{
  return false
  }
}

func StoreUser(c *models.SignUpRequest)bool{
  var usr models.LoginStorage
  usr.Email = c.Email
  usr.PassHash = hashString(c.Password)

  if _, ok := Auth[usr.Email]; ok{
    return false
  }else{
  Auth[usr.Email] = usr.PassHash
    return true
  }
}

func hashString(s string)[]byte{
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
