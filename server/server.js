const express = require('express')
const app = express()
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { schema } = require('./schema.js');
const { resolvers } = require('./resolvers.js');
const http = require('http');
const cors = require('cors');
const { json } = require('body-parser');
const { expressMiddleware } = require('@apollo/server/express4');
const mongoose = require('mongoose')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const start = async() => {
  await mongoose.connect('mongodb://localhost:27017/ToDoUsers',{
      useNewUrlParser: true,
      useUnifiedTopology: true
  });
}

const httpServer = http.createServer(app);
const server = new ApolloServer({
  schema,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const startServer = async () => {
  await startStandaloneServer(server, {
    listen: { port: 5555 },
  });
  console.log(`Server ready at: localhost:5555`);
  console.log('Query at: https://studio.apollographql.com/dev');

  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  app.listen(5551, () => {
    console.log('Connesso alla porta: 5551');
  });
};

start()
startServer();

module.exports = {app}