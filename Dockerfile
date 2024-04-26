FROM node:16

COPY build .

EXPOSE 8080

CMD ["node", "server.js"]

