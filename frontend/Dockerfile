FROM node:20
WORKDIR /app
COPY package.json ./
RUN npm install -g react-scripts && npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
