###
# Build stage
###
FROM node:12-alpine AS builder
WORKDIR /builder

COPY package.json yarn.lock ./
COPY packages/app/package.json packages/app/
COPY packages/app/patches patches
RUN yarn app install --frozen-lockfile && yarn patch-package

COPY tsconfig.base.json ./
COPY packages/app/tsconfig.json packages/app/next.config.js packages/app/

COPY packages/types packages/types
COPY packages/app/public packages/app/public
COPY packages/app/styles packages/app/styles
COPY packages/app/pages packages/app/pages
COPY packages/app/src packages/app/src

RUN NODE_OPTIONS="--inspect --max_old_space_size=4096" yarn app build && rm -rf packages/app/.next/cache

###
# Exec Stage
###
FROM node:12-alpine
WORKDIR /app

COPY package.json yarn.lock ./
COPY packages/app/package.json packages/app/
COPY packages/app/patches patches
RUN yarn app install --frozen-lockfile --production && yarn patch-package

COPY --from=builder /builder/packages/app/public ./packages/app/public
COPY --from=builder /builder/packages/app/.next ./packages/app/.next
COPY --from=builder /builder/packages/app/next.config.js ./packages/app/

CMD ["yarn", "app", "start"]