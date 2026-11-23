# W&B Instruments website + backend. Build: docker build -t wb-website .  Run: docker run -p 8787:8787 --env-file server/.env -v wbdata:/app/server/data wb-website
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8787
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY server ./server
COPY src/data/company.ts ./src/data/company.ts
RUN mkdir -p server/data && chown -R node:node server/data
USER node
EXPOSE 8787
HEALTHCHECK CMD wget -qO- http://localhost:8787/api/health || exit 1
CMD ["node", "server/index.mjs"]
