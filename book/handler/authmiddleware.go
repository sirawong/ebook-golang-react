package handler

import (
	"book/logs"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func tokenAuthAdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		req, err := http.NewRequest("POST", viper.GetString("auth.uri"), nil)
		if err != nil {
			logs.Error(err)
			return
		}
		cookie, err := c.Request.Cookie("ac")
		if err != nil {
			logs.Error(err)
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Not found Access Token"})
		}

		req.AddCookie(&http.Cookie{Name: "ac", Value: cookie.Value})
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			logs.Error(err)
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Unexpected error"})
			return
		}
		defer resp.Body.Close()

		var level map[string]string
		err = json.NewDecoder(resp.Body).Decode(&level)
		if err != nil {
			logs.Error(err)
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Unexpected error"})
			return
		}

		if level["level"] != "admin" {
			logs.Error(err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		c.Next()
	}
}
