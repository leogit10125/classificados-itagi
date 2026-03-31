FROM node:20-alpine
WORKDIR /app
COPY package*.json ./

# A flag abaixo ignora o conflito de versões do ESLint
RUN npm install --legacy-peer-deps

COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]