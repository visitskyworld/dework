###
# Build stage
###
FROM node:16-alpine as builder
WORKDIR /builder

COPY package.json yarn.lock ./
COPY packages/api/package.json packages/api/

# https://github.com/docker/getting-started/issues/124#issuecomment-779806159
RUN apk --no-cache --virtual build-dependencies add \
        python3 \
        make \
        g++ \
&& yarn api install --frozen-lockfile \
&& apk del build-dependencies

COPY tsconfig.base.json .
COPY packages/api/tsconfig.json packages/api/
COPY packages/api/src packages/api/src
COPY packages/api/types packages/api/types
RUN yarn api build

###
# Exec Stage
###
FROM node:16-alpine
WORKDIR /app

COPY package.json yarn.lock ./
COPY packages/api/package.json packages/api/
COPY packages/api/patches patches

# https://github.com/docker/getting-started/issues/124#issuecomment-779806159
RUN apk --no-cache --virtual build-dependencies add \
        python3 \
        make \
        g++ \
&& yarn api install --frozen-lockfile --production \
&& yarn patch-package \
&& apk del build-dependencies

COPY --from=builder /builder/packages/api/build packages/api/build

CMD [ "yarn", "api", "start" ]
