const exportFile = require('./contacts');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const PORT = 3000;
const Joi = require('@hapi/joi');
const uuid = require('uuid');

const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});
app.get('/api/contacts', getUsers);

app.get('/api/contacts/:contactId', getUser);

app.post('/api/contacts', validate(createUserSchema), createUser);

app.delete('/api/contacts/:id', deleteUser);

const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
}).min(1);
app.patch('/api/contacts/:id', validateUpdate(updateUserSchema), updateUser);

async function getUsers(req, res, next) {
  const result = await exportFile.listContacts();
  res.status(200).send(result);
}

async function getUser(req, res, next) {
  const user = await exportFile.getContactById(req.params.contactId);
  if (!user) {
    return res.status(404).send({ message: 'Not found' });
  }
  return res.status(200).send(user);
}

async function createUser(req, res, next) {
  const id = uuid.v4();
  const newUser = {
    id,
    ...req.body,
  };
  const addUser = await exportFile.addContact(newUser);
  res.status(200).send(addUser);
}

async function deleteUser(req, res, next) {
  const { id } = req.params;
  const delUser = await exportFile.removeContact(Number(id));
  if (!delUser) {
    res.status(404).send({ message: 'Not found' });
  }
  res.status(200).json({ message: 'contact deleted' });
}

async function updateUser(req, res, next) {
  const { id } = req.params;

  const updateUserFields = await exportFile.updateContact(Number(id), req.body);
  if (!updateUserFields) {
    return res.status(404).send({ message: 'Not found' });
  }
  return res.status(200).send(updateUserFields);
}

function validate(schema) {
  return (req, res, next) => {
    console.log('valid', req.body);
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send({ message: 'missing required name field' });
    }
    next();
  };
}

function validateUpdate(schema) {
  return (req, res, next) => {
    console.log('valid', req.body);
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send({ message: 'missing fields' });
    }
    next();
  };
}

app.use((err, req, res, next) => {
  const { message, status } = err;
  res.status(status || 500).send(message);
});

app.listen(PORT, () => {
  console.log('Server started listening on port', PORT);
});
