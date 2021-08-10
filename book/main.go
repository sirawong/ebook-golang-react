package main

import (
	"book/handler"
	"book/logs"
	"book/repository"
	"book/service"
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
	bookRepositoryDB := repository.NewBookRepository(client, cld)
	bookService := service.NewBookService(bookRepositoryDB)
	bookHandler := handler.NewBooksHandler(bookService)

	router := handler.NewRoutes()
	router.Cors()
	router.Router(bookHandler)

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
