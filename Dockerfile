FROM node:22

WORKDIR /usr/src/app

RUN npm install -g pnpm@latest

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]