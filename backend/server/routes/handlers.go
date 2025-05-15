package routes

import (
	"Umbra/backend/goleo"
	"Umbra/backend/models"
	"Umbra/backend/server/storage"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
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

func HandleProofGen(c *gin.Context) {
	var lp *goleo.LeoProject
	var err error

	lp, err = goleo.InitFromCircuitWithOptions(goleo.InitOptions{
		ProjectName: "geoproof",
		LeoBin:      "leo",
		CircuitPath: "../geoproof/src/main.leo",
	})

	if err != nil {
		//try to save the request
		log.Println("InitWithOptions failed, retrying with default InitFromCircuit", err)

		lp, err = goleo.InitFromCircuit("../geoproof/src/main.leo")
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ApiResponse{
				Valid: false,
				Error: "",
			})
			return

		}
	}

	//cleanup Logic
	defer func() {
		cleanupErr := lp.Cleanup()
		if cleanupErr != nil {
			log.Println("Failed to clean up files: ", cleanupErr)
			return
		}
	}()

	dir, dirErr := os.Getwd()
	if dirErr != nil {
		log.Println("Could not get working directory")
	}
	log.Println("current working directory: ", dir)
	var p models.ProofRequest
	var resp models.ApiResponse
	bindErr := c.ShouldBindJSON(&p)
	if bindErr != nil {
		log.Println("Failed to bind to proof request: ", bindErr)
		resp.Valid = false
		c.JSON(http.StatusBadRequest, resp)
		return
	}
	out, runErr := lp.Run("main",
		p.PrivateLocation.Latitude,
		p.PrivateLocation.Longitude,
		p.PublicLocation.Latitude,
		p.PublicLocation.Longitude,
		p.Radius)
	if runErr != nil {
		log.Println("failed to run", out, runErr)
	}
	result, parseErr := goleo.ParseOutput(out)
	if parseErr != nil {
		log.Println(parseErr)
		resp.Valid = false
		c.JSON(http.StatusBadRequest, resp)
		return
	}
	storage.SetUserVerification(p.UserId, p.GroupId, result)
	if result {
		resp.Valid = true
		c.JSON(http.StatusOK, resp)
		return
	}
	resp.Valid = false
	c.JSON(http.StatusOK, resp)
}

// HandleValidate check if user proof is valid
func HandleValidate(c *gin.Context) {
	var req models.ValidateRequest
	var resp models.ApiResponse
	resp.Valid = storage.ValidateVerification(req.UserId, req.GroupId)
	c.JSON(http.StatusOK, resp)
}
