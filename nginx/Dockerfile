FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage-name /app/out /usr/share/nginx/html
EXPOSE 80