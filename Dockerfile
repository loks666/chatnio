FROM nginx:stable-alpine
COPY ./dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# 使用官方的 Golang 镜像作为基础镜像
FROM golang:1.17

# 在容器内设置工作目录
WORKDIR /app

# 添加 libwebp
RUN apt-get update && apt-get install -y libwebp-dev

# 复制本地代码到容器内
COPY . .

# 构建 Go 程序
RUN go build -o bot

# 指定容器启动时运行的命令
CMD ["./bot"]
