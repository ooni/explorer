# Based on https://nextjs.org/docs/deployment#docker-image

# Build: run ooni-sysadmin.git/scripts/docker-build from this directory

# Note: node:16.3-alpine3.12 is chosen as a workaround to build issues on darwin/arm64
# Based on this issue: https://github.com/docker/for-mac/issues/5831

# Install dependencies only when needed
FROM node:16.3-alpine3.12 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16.3-alpine3.12 AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

ARG NODE_ENV ${NODE_ENV:-production}
ARG GIT_COMMIT_SHA_SHORT ${GIT_COMMIT_SHA_SHORT}

ENV NODE_ENV ${NODE_ENV}
ENV GIT_COMMIT_SHA_SHORT ${GIT_COMMIT_SHA_SHORT}

RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:16.3-alpine3.12 AS runner
WORKDIR /app
ARG NODE_ENV ${NODE_ENV:-production}
ENV NODE_ENV ${NODE_ENV}
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3100

ARG NODE_ENV ${NODE_ENV:-production}
ENV NODE_ENV ${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]
