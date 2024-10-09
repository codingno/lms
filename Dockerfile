#Build stage
FROM node:16.13-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# #Production stage
FROM node:16.13-alpine AS production

WORKDIR /app

COPY package*.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build


EXPOSE 3003 3031

CMD ["npm", "start"]
