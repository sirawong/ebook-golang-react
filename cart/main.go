package main

import (
	"cart/handler"
	"cart/logs"
	"cart/repository"
	"cart/service"
	"fmt"
	"strings"
	"time"

	"github.com/spf13/viper"
)

func main() {
	initTimeZone()
	initConfig()

	client := repository.ConnectDB()
	cartRepositoryDB := repository.NewCartRepository(client)
	cartService := service.NewCartService(cartRepositoryDB)
	cartHandler := handler.NewCartsHandler(cartService)

	router := handler.NewRoutes()
	router.Cors()
	router.Router(cartHandler)

	port := viper.GetString("app.port")
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
