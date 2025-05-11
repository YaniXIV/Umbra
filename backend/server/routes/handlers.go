package routes

import (
	"Umbra/backend/models"
	"Umbra/backend/server/storage"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

// post request
func HandleCreateGroup(c *gin.Context) {
	var req models.Group
	var resp models.ApiResponse

	if err := c.ShouldBindJSON(&req); err != nil {
		//change this later
		resp.Valid = false
		resp.Error = err.Error()
		c.JSON(http.StatusBadRequest, resp)
		return
	}
	storage.CreateGroup(&req)
	resp.Valid = true
	c.JSON(http.StatusOK, resp)
	return
}

// post request
func HandleJoinGroup(c *gin.Context) {
	//idk, join a group or something

}

// post request
func HandleVerify(c *gin.Context) {
	//idk, Verify a proof or something
	fmt.Println("Verify the Proof!")
}

// get request
func HandleVerifiedList(c *gin.Context) {
	//idk, return list of verified users or something
}

func HandleLogin(c *gin.Context) {
	var req models.LoginRequest
	var resp models.ApiResponse
	if err := c.ShouldBindJSON(&req); err != nil {
		resp.Valid = false
		c.JSON(http.StatusBadRequest, resp)
		return
	}
	if storage.AuthenticateUser(&req) {
		resp.Valid = true
		c.JSON(http.StatusOK, resp)
		return
	}
	resp.Valid = false
	c.JSON(http.StatusUnauthorized, resp)
}

func HandleSignup(c *gin.Context) {
	var req models.SignUpRequest
	var resp models.ApiResponse
	if err := c.ShouldBindJSON(&req); err != nil {
		resp.Valid = false
		c.JSON(http.StatusBadRequest, resp)
		return
	}
	if storage.StoreUser(&req) {
		resp.Valid = true
		c.JSON(http.StatusOK, resp)
		return
	}
	resp.Valid = false
	c.JSON(http.StatusConflict, resp)
}
