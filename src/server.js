require('./config');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const { authRouter } = require('./auth/auth.router');

module.exports = class AuthServer {
  constructor() {
    this.app = null;
  }
  async start() {
    this.initServer();
    await this.initDatabaseConnection();
    this.initMiddleware();
    this.initRoutes();
    this.initErrorHandling();
    this.startListening();
  }

  initServer() {
    this.app = express();
  }

  async initDatabaseConnection() {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  }

  initMiddleware() {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(cors({ origin: 'http://localhost:3000' }));
    this.app.use(morgan('tiny'));
  }

  initRoutes() {
    this.app.use('/auth', authRouter);
    this.app.post('/', (req, res) => {
      res.send('hello gad');
    });
  }

  initErrorHandling() {
    this.app.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      return res.status(statusCode).send(err.message);
    });
  }

  startListening() {
    const { PORT } = process.env;

    this.app.listen(PORT, () => {
      console.log('Server started listening on port', process.env.PORT);
    });
  }
};
