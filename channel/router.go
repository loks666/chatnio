package channel

import "github.com/gin-gonic/gin"

func Register(app *gin.Engine) {
	app.GET("/admin/channel/list", GetChannelList)
	app.POST("/admin/channel/create", CreateChannel)
	app.GET("/admin/channel/get/:id", GetChannel)
	app.POST("/admin/channel/update/:id", UpdateChannel)
	app.GET("/admin/channel/delete/:id", DeleteChannel)
	app.GET("/admin/channel/activate/:id", ActivateChannel)
	app.GET("/admin/channel/deactivate/:id", DeactivateChannel)

	app.GET("/admin/charge/list", GetChargeList)
	app.POST("/admin/charge/set", SetCharge)
	app.GET("/admin/charge/delete/:id", DeleteCharge)
}
