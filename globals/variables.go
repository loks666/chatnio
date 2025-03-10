package globals

import (
	"github.com/gin-gonic/gin"
	"net/url"
	"strings"
)

const ChatMaxThread = 5
const AnonymousMaxThread = 1

var AllowedOrigins = []string{
	"chatnio.net",
	"nextweb.chatnio.net",
	"fystart.cn",
	"fystart.com",
}

func OriginIsAllowed(uri string) bool {
	instance, _ := url.Parse(uri)
	if instance == nil {
		return false
	}

	if instance.Hostname() == "localhost" || instance.Scheme == "file" {
		return true
	}

	if strings.HasPrefix(instance.Host, "www.") {
		instance.Host = instance.Host[4:]
	}

	return in(instance.Host, AllowedOrigins)
}

func OriginIsOpen(c *gin.Context) bool {
	return strings.HasPrefix(c.Request.URL.Path, "/v1") || strings.HasPrefix(c.Request.URL.Path, "/dashboard")
}

const (
	GPT3Turbo             = "gpt-3.5-turbo"
	GPT3TurboInstruct     = "gpt-3.5-turbo-instruct"
	GPT3Turbo0613         = "gpt-3.5-turbo-0613"
	GPT3Turbo0301         = "gpt-3.5-turbo-0301"
	GPT3Turbo1106         = "gpt-3.5-turbo-1106"
	GPT3Turbo16k          = "gpt-3.5-turbo-16k"
	GPT3Turbo16k0613      = "gpt-3.5-turbo-16k-0613"
	GPT3Turbo16k0301      = "gpt-3.5-turbo-16k-0301"
	GPT4                  = "gpt-4"
	GPT4All               = "gpt-4-all"
	GPT4Vision            = "gpt-4-v"
	GPT4Dalle             = "gpt-4-dalle"
	GPT40314              = "gpt-4-0314"
	GPT40613              = "gpt-4-0613"
	GPT41106Preview       = "gpt-4-1106-preview"
	GPT41106VisionPreview = "gpt-4-vision-preview"
	GPT432k               = "gpt-4-32k"
	GPT432k0314           = "gpt-4-32k-0314"
	GPT432k0613           = "gpt-4-32k-0613"
	Dalle2                = "dall-e-2"
	Dalle3                = "dall-e-3"
	Claude1               = "claude-1"
	Claude1100k           = "claude-1.3"
	Claude2               = "claude-1-100k"
	Claude2100k           = "claude-2"
	Claude2200k           = "claude-2.1"
	ClaudeSlack           = "claude-slack"
	SparkDesk             = "spark-desk-v1.5"
	SparkDeskV2           = "spark-desk-v2"
	SparkDeskV3           = "spark-desk-v3"
	ChatBison001          = "chat-bison-001"
	BingCreative          = "bing-creative"
	BingBalanced          = "bing-balanced"
	BingPrecise           = "bing-precise"
	ZhiPuChatGLMTurbo     = "zhipu-chatglm-turbo"
	ZhiPuChatGLMPro       = "zhipu-chatglm-pro"
	ZhiPuChatGLMStd       = "zhipu-chatglm-std"
	ZhiPuChatGLMLite      = "zhipu-chatglm-lite"
	QwenTurbo             = "qwen-turbo"
	QwenPlus              = "qwen-plus"
	QwenTurboNet          = "qwen-turbo-net"
	QwenPlusNet           = "qwen-plus-net"
	Midjourney            = "midjourney"
	MidjourneyFast        = "midjourney-fast"
	MidjourneyTurbo       = "midjourney-turbo"
	StableDiffusion       = "stable-diffusion"
	LLaMa270B             = "llama-2-70b"
	LLaMa213B             = "llama-2-13b"
	LLaMa27B              = "llama-2-7b"
	CodeLLaMa34B          = "code-llama-34b"
	CodeLLaMa13B          = "code-llama-13b"
	CodeLLaMa7B           = "code-llama-7b"
	Hunyuan               = "hunyuan"
	GPT360V9              = "360-gpt-v9"
	Baichuan53B           = "baichuan-53b"
	SkylarkLite           = "skylark-lite-public"
	SkylarkPlus           = "skylark-plus-public"
	SkylarkPro            = "skylark-pro-public"
	SkylarkChat           = "skylark-chat"
)

var GPT4Array = []string{
	GPT4, GPT40314, GPT40613, GPT41106Preview, GPT41106VisionPreview,
	GPT4Vision, GPT4Dalle, GPT4All,
}

func in(value string, slice []string) bool {
	for _, item := range slice {
		if item == value {
			return true
		}
	}
	return false
}

func IsGPT4NativeModel(model string) bool {
	return in(model, GPT4Array)
}

func IsDalleModel(model string) bool {
	return model == Dalle2 || model == Dalle3
}

func IsClaude100KModel(model string) bool {
	return model == Claude1100k || model == Claude2100k || model == Claude2200k
}

func IsMidjourneyFastModel(model string) bool {
	return model == MidjourneyFast
}
