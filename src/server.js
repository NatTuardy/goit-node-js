require('./config');
const express = require('express');
const mongoose = require('mongoose');
const { contactsRouter } = require('./contacts/contacts.router');

module.exports = class ContactsServer {
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
    // console.log('ENV:', process.env.MONGODB_URL);
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
      });
      console.log('Database connection successful');
    } catch (err) {
      console.error('App starting error:', err.stack);
      process.exit(1);
    }
  }

  initMiddleware() {
    this.app.use(express.json());
  }

  initRoutes() {
    this.app.use('/api/contacts', contactsRouter);
  }

  initErrorHandling() {
    this.app.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      return res.status(statusCode).send(err.message);
    });
  }

  startListening() {
    const { PORT } = process.env;
    // console.log('PORT', PORT);
    this.app.listen(PORT, () => {
      console.log('Server started listening on port', process.env.PORT);
    });
  }
};

// console.log(process.env);
