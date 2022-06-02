FROM node:10 AS builder
WORKDIR /app/
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src src
COPY config config
RUN npm run build

FROM node:10
WORKDIR /app/
COPY package*.json ./
RUN npm ci
COPY --from=builder /app/dist/src /app/src
COPY --from=builder /app/dist/config /app/config

EXPOSE 3030
CMD ["node", "src/index.js"]