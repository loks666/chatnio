package manager

import (
	"chat/manager/broadcast"
	"github.com/gin-gonic/gin"
)

func Register(app *gin.Engine) {
	app.GET("/chat", ChatAPI)
	app.GET("/v1/models", ModelAPI)
	app.GET("/dashboard/billing/usage", GetBillingUsage)
	app.GET("/dashboard/billing/subscription", GetSubscription)
	app.POST("/v1/chat/completions", TranshipmentAPI)

	broadcast.Register(app)
}
