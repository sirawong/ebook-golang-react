# Base image
FROM golang:1.16-buster AS build

# # Build stage
# FROM base as build
# WORKDIR /app
# COPY go.mod ./
# COPY go.sum ./
# RUN go mod download
# COPY . .
# RUN go build -o /cart

# # Run stage
# FROM base
# WORKDIR /
# COPY --from=build /cart /cart
# EXPOSE 8000
# CMD [ "/cart" ]


# # Base image for building the go project
# FROM golang:1.14-alpine AS build

# Updates the repository and installs git
RUN apk update && apk upgrade && \
    apk add --no-cache git

# Switches to /tmp/app as the working directory, similar to 'cd'
WORKDIR /tmp/app

## If you have a go.mod and go.sum file in your project, uncomment lines 13, 14, 15

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

# Builds the current project to a binary file called api
# The location of the binary file is /tmp/app/out/api
RUN GOOS=linux go build -o ./out/user .

#########################################################

# The project has been successfully built and we will use a
# lightweight alpine image to run the server 
FROM alpine:latest

# Adds CA Certificates to the image
RUN apk add ca-certificates

# Copies the binary file from the BUILD container to /app folder
COPY --from=build /tmp/app/out/user /app/user

# Switches working directory to /app
WORKDIR "/app"

# Exposes the 5000 port from the container
EXPOSE 8000

# Runs the binary once the container starts
CMD ["./user"]