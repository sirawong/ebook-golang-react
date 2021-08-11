package handler

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/spf13/viper"
)

type routes struct {
	router *gin.Engine
}

func NewRoutes() routes {
	r := routes{
		router: gin.Default(),
	}
	return r
}

func (r routes) Cors() {
	r.router.Use(
		cors.New(cors.Config{
			AllowOrigins:     []string{viper.GetString("esb.uri")},
			AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
			AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
		}),
	)
}

func (r routes) Run(addr ...string) error {
	return r.router.Run(addr...)
}
