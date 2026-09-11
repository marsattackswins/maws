# MAWS container image. Run behind the provided nginx config (or equivalent)
# with MAWS_TRUST_PROXY=true and a fixed egress IP for Binance allowlisting.
#
# Build:  docker build -f deploy/Dockerfile -t maws .
# Run:    docker run --env-file /etc/maws/maws.env -p 127.0.0.1:3000:3000 -v maws-data:/app/.maws maws

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV MAWS_NEXT_DIST_DIR=.next
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
