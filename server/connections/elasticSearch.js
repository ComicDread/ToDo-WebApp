const {Client} = require('@elastic/elasticsearch');
require('dotenv').config(); 

const client = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: process.env.USERNAME,
    password:  process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = {client};
