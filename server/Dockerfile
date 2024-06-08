FROM node:latest

WORKDIR /Resource-Mentor/server

COPY package*.json /Resource-Mentor/server/
RUN npm install --force -g

COPY . /Resource-Mentor/server

#ENTRYPOINT [ "/Resource-Mentor/server/entrypoint.sh" ]
CMD ["npm", "start"]
