FROM node:18.19.1

WORKDIR /app

COPY . /app

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve", "--disable-host-check", "--host", "0.0.0.0"]
