FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
RUN mkdir -p uploads
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
