package server

import (
	"Umbra/backend/globals"
	"Umbra/backend/server/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func InitServer() {

	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // or specify: []string{"http://localhost:3000"}
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	//routes
	r.POST("/creategroup", routes.HandleCreateGroup)
	r.GET("/groups", routes.HandleGetGroups)
	r.POST("/joingroup", routes.HandleJoinGroup)
	r.POST("/verify", routes.HandleVerify)
	//r.POST("/auth/check", routes.HandleCheck)
	r.POST("/auth/login", routes.HandleLogin)
	r.POST("/auth/signup", routes.HandleSignup)
	r.GET("/verifiedlist", routes.HandleVerifiedList)
	r.POST("/proof", routes.HandleProofGen)
	r.POST("/Validate", routes.HandleValidate)

	err := r.Run(globals.PORT)
	if err != nil {
		panic(err)
	}
}
