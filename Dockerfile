FROM node:24 AS build

WORKDIR /app

# Install dependencies.
COPY package.json ./
RUN npm install

# Copy the rest of the project and build the production bundle.
COPY . .
RUN npm run build

# Use a small web server image for the static assets built by Vite.
FROM nginx:1.27-alpine AS runner

# Replace the default server config so SPA routes fall back to index.html.
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
