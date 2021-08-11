FROM golang:buster AS build

WORKDIR /app
# COPY vendor ./
COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . ./

RUN go build -o /cart

##
## Deploy
##

FROM gcr.io/distroless/base-debian10

WORKDIR /

COPY --from=build /cart /cart

EXPOSE 8000

USER nonroot:nonroot

ENTRYPOINT ["/cart"]