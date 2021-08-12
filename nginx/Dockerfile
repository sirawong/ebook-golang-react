FROM nginx:alpine

EXPOSE 80 443

# Set working directory
WORKDIR /app

# Copy over entrypoint
COPY ./nginx-entrypoint.sh /usr/local/bin/nginx-entrypoint.sh

# Copy Nginx config template
RUN rm /etc/nginx/conf.d/default.conf
COPY ./default.conf /etc/nginx/conf.d/default.conf

# Nginx init
RUN ["chmod", "+x", "/usr/local/bin/nginx-entrypoint.sh"]
ENTRYPOINT ["/usr/local/bin/nginx-entrypoint.sh"]