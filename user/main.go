package main

import (
	"auth/handler"
	"auth/logs"
	"auth/repository"
	"auth/service"
	"fmt"
	"strings"
	"time"

	"github.com/spf13/viper"
)

func main() {
	initTimeZone()
	initConfig()

	client := repository.ConnectDB()
	cld := repository.CldryConnect()
	userRepositoryDB := repository.NewUserRepository(client, cld)
	userService := service.NewUserService(userRepositoryDB)
	userHandler := handler.NewUserHandler(userService)

	router := handler.NewRoutes()
	router.Cors()
	router.Router(userHandler)

	service.InitRedis()
	port := viper.GetString("app.user_port")
	logs.Info("Start service at port " + port)
	err := router.Run(fmt.Sprintf(":%v", port))
	if err != nil {
		panic(err)
	}
}

func initConfig() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	viper.ReadInConfig()
}

func initTimeZone() {
	ict, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		panic(err)
	}

	time.Local = ict
}
