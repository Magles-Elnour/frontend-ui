# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# Copy dependency files first (better layer caching)
COPY package*.json ./
RUN npm ci --prefer-offline

# Copy source and build for production
COPY . .
RUN npm run build -- --configuration production

# ─── Stage 2: Serve with Nginx ────────────────────────────────────────────────
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static content
RUN rm -rf ./*

# Copy built Angular app (output path from angular.json: dist/magles-elnour/browser)
COPY --from=build /app/dist/magles-elnour/browser .

# Copy nginx config for Angular routing (HTML5 pushState)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
