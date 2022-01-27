###
# Build stage
###
FROM node:16-alpine AS builder
WORKDIR /builder

COPY package.json yarn.lock ./
COPY packages/app/package.json packages/app/
COPY packages/landing-page/package.json packages/landing-page/
COPY packages/app/patches patches
RUN yarn app install --frozen-lockfile && yarn patch-package

COPY tsconfig.base.json ./
COPY packages/app/tsconfig.json packages/app/
COPY packages/landing-page/tsconfig.json packages/landing-page/next.config.js packages/landing-page/

COPY packages/types packages/types
COPY packages/app/styles packages/app/styles
COPY packages/app/src packages/app/src
COPY packages/landing-page/components packages/landing-page/components
COPY packages/landing-page/public packages/landing-page/public
COPY packages/landing-page/pages packages/landing-page/pages

RUN NODE_OPTIONS="--inspect --max_old_space_size=4096" yarn lp build && rm -rf packages/landing-page/.next/cache

###
# Exec Stage
###
FROM node:16-alpine
WORKDIR /app

COPY package.json yarn.lock ./
COPY packages/app/package.json packages/app/
COPY packages/landing-page/package.json packages/landing-page/
RUN yarn app install --frozen-lockfile --production

COPY --from=builder /builder/packages/landing-page/public ./packages/landing-page/public
COPY --from=builder /builder/packages/landing-page/.next ./packages/landing-page/.next
COPY --from=builder /builder/packages/landing-page/next.config.js ./packages/landing-page/

CMD ["yarn", "lp", "start"]