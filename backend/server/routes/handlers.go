package routes 

import(
  "fmt"
  "github.com/gin-gonic/gin"
  "Umbra/backend/server/storage"
  "Umbra/backend/models"
  "net/http"
)


//post request
func HandleCreateGroup(c *gin.Context){
  //idk, create a group or something 
  fmt.Println("Hello Group!")
  var group models.Group

  if err := c.ShouldBindJSON(&group); err != nil{
    //change this later
  c.JSON(http.StatusBadRequest, gin.H{"status":"Invalid Group Creation", "Group":"NIL"})
  }
  storage.CreateGroup(&group)

  c.JSON(http.StatusOK, gin.H{"status":"Group Created", "Group":group.name})
}

//post request
func HandleJoinGroup(c *gin.Context){
  //idk, join a group or something

  


}

//post request
func HandleVerify(c *gin.Context){
  //idk, Verify a proof or something  
  fmt.Println("Verify the Proof!")
}

//get request
func HandleVerifiedList(c *gin.Context){
  //idk, return list of verified users or something
}

func HandleLogin(c *gin.Context){
  var req models.LoginRequest
  var resp models.LoginResponse
  if err := c.ShouldBindJSON(&req); err != nil{
    resp.Valid = false
    c.JSON(http.StatusBadRequest, resp)
    return 
  }
  if storage.AuthenticateUser(&req){
    resp.Valid = true
    c.JSON(http.StatusOK, resp)
    return 
  }
    resp.Valid = false
    c.JSON(http.StatusUnauthorized, resp)
}

func HandleSignup(c *gin.Context){
  var req models.SignUpRequest
  var resp models.SignUpResponse
  if err := c.ShouldBindJSON(&req); err != nil{
    resp.Valid = false
    c.JSON(http.StatusBadRequest, resp)
    return 
  }
  if storage.StoreUser(&req){
    resp.Valid = true
    c.JSON(http.StatusOK, resp)
    return 
  }
    resp.Valid = false
    c.JSON(http.StatusConflict, resp)
}

func HandleCheck(c *gin.Context){
  
}

