FROM node:8
WORKDIR /home/nodejs/app
COPY . .
RUN npm install -g serverless
RUN npm install
EXPOSE 3000
CMD ["serverless", "offline"]
