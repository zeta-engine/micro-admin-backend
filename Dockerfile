FROM node:12.13.0-alpine
RUN mkdir -p /opt/micro-admin-backend
WORKDIR /opt/micro-admin-backend
RUN adduser -S micro-admin-backend
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]