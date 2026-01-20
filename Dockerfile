# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

WORKDIR /usr/src/app

# Install only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copy source
COPY . .

# Ensure the non-root node user owns the workspace
RUN chown -R node:node /usr/src/app
USER node

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

CMD ["node", "./bin/www"]
