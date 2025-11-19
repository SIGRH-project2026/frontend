FROM node:18.12.1 AS build
WORKDIR /app
RUN npm cache clean --force
COPY . .
RUN npm install --force
RUN npm run build --prod
RUN ls -l /app

FROM nginx:1.22 AS ngi
COPY --from=build /app/dist/frontend_mfpai /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 80