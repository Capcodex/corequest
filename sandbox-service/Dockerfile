FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=development
RUN apk add --no-cache docker-cli
COPY package.json ./
EXPOSE 4000
CMD ["sh", "-c", "docker pull rust:1.78-alpine >/dev/null 2>&1 || true; npm install && npm run dev"]
