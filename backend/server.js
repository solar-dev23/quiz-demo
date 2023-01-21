import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import routes from './routes';
import connectToDb from './core/db/connect';
import config from './core/config';

// Connecting Database
connectToDb();

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(cors());

// Index route
app.get('/', (req, res) => {
  res.send('Node API');
});

app.use('/', routes());

// PORT
app.listen(config.serverPort, () => {
  console.log(`Connected to port '${config.serverPort}`);
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ message: `Server Error: ${err.message}` });
});
