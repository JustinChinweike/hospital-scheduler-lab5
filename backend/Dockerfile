FROM node:18-alpine AS build
WORKDIR /app/backend
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app/backend
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/backend/dist ./dist
RUN mkdir -p uploads
EXPOSE 5000
CMD ["node", "dist/index.js"]
