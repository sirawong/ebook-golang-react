# Ebook-golang-react
- Developed an E-book Shop web application using React and Go that allows user to search, filter, or add to cart and allow admin to perform CRUD operations Books service and JWT Authentication.
- Designed RESTful API by using 3 services of Go: Users, Books, and Carts to communicate with client side and enabling data to be stored persistently on MongoDB Atlas through Nginx for api gateway.
  - Used Users service for authorized access resources by combining JWT authentication and Redis to implemented the concept of a refresh token to check whether the token is valid or invalid.
  - Operated Books service by using CRUD.
  - Used Carts service to send and receive cart metadata from client side and store on database.
- Deployed to AWS Elastic Beanstalk through automated dockerizing on GitHub Workflows.
- Utilized: Go, MongoDB, Docker, Redis, React, AWS, GIT, Nginx

Example: http://ebook-env.eba-pwjpkqri.ap-southeast-1.elasticbeanstalk.com

!["Image"](https://github.com/sirawong/ebook-golang-react/blob/69c765c479f90ebc05e9e8de1e735b0d4c021e58/Elastic%20Beanstalk%20Instance.jpg)
