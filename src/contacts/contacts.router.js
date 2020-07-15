const Joi = require('@hapi/joi');
Joi.objectid = require('joi-objectid')(Joi);

const { Router } = require('express');
// const {
//   createContact,
//   getContacts,
//   getContact,
//   updateContact,
//   deleteContact,
// } = require('./contacts.controller');

const { createControllerProxy } = require('../helpers/controller.proxy');
const contactController = require('./contacts.controller');
const contactControllerProxy = createControllerProxy(contactController);

const router = Router();
const { validate } = require('../helpers/validate');

const userIdSchema = Joi.object({
  id: Joi.objectid(),
});

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  subscription: Joi.string().required(),
  password: Joi.string().required(),
});

router.post(
  '/',
  validate(createUserSchema),
  contactControllerProxy.createContact,
);

router.get('/', contactControllerProxy.getContacts);

router.get(
  '/:id',
  validate(userIdSchema, 'params'),
  contactControllerProxy.getContact,
);

const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  subscription: Joi.string(),
}).min(1);

router.put(
  '/:id',
  validate(userIdSchema, 'params'),
  validate(updateUserSchema),
  contactControllerProxy.updateContact,
);

router.delete(
  '/:id',
  validate(userIdSchema, 'params'),
  contactControllerProxy.deleteContact,
);

exports.contactsRouter = router;
