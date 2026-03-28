FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Build
FROM base AS build
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Production
FROM node:18-alpine AS production
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/index.js"]
