FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@latest
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
EXPOSE 3000
COPY ./nginx-frontend/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html