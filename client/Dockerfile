FROM node:latest

WORKDIR /Resource-Mentor/client

COPY package*.json /Resource-Mentor/client/
RUN npm install --force -g

COPY . /Resource-Mentor/client

ENV BROWSER none

#ENTRYPOINT [ "/Resource-Mentor/client/entrypoint.sh" ]
CMD ["npm", "start"]
