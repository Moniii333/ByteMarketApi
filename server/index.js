require('dotenv').config();
const { PORT = 4000 } = process.env;
const express = require('express');
const cors = require('cors');
const server = express();


const corsOptions = {
  origin: 'http://localhost:5173',
}
// Configure CORS
server.use(cors(corsOptions))

const bodyParser = require('body-parser');
server.use(bodyParser.json());

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

const apiRouter = require('./api');
server.use('/api', apiRouter);

const stripeRoutes = require('./api/stripe')
server.use('/stripe', stripeRoutes)

const client = require('./db/client');
client.connect();

server.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});
