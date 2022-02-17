###
# Build stage
###
FROM node:16-alpine AS builder
WORKDIR /builder

COPY package.json yarn.lock ./
COPY packages/app/package.json packages/app/
COPY packages/nft/package.json packages/nft/
RUN yarn app install --frozen-lockfile

COPY tsconfig.base.json ./
COPY packages/app/tsconfig.json packages/app/
COPY packages/nft/tsconfig.json packages/nft/

COPY packages/types packages/types
COPY packages/app/styles packages/app/styles
COPY packages/app/public packages/app/public
COPY packages/nft/public packages/nft/public
COPY packages/nft/pages packages/nft/pages
COPY packages/nft/styles packages/nft/styles
COPY packages/nft/src packages/nft/src

RUN NODE_OPTIONS="--inspect --max_old_space_size=4096" yarn nft build && rm -rf packages/nft/.next/cache

###
# Exec Stage
###
FROM node:16-alpine
WORKDIR /app

COPY package.json yarn.lock ./
COPY packages/app/package.json packages/app/
COPY packages/nft/package.json packages/nft/
RUN yarn app install --frozen-lockfile --production

COPY --from=builder /builder/packages/nft/public ./packages/nft/public
COPY --from=builder /builder/packages/nft/styles ./packages/nft/public
COPY --from=builder /builder/packages/nft/.next ./packages/nft/.next

CMD ["yarn", "nft", "start"]