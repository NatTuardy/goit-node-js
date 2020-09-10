const { Router } = require('express');
const Joi = require('@hapi/joi');
const { validate } = require('../helpers/validate');
const { deleteUser } = require('./auth.controller');
const authController = require('./auth.controller');
const { createControllerProxy } = require('../helpers/controllers.proxy');
const { authorize, authorizeWithCookies } = require('./auth.middleware');

const authControllerProxy = createControllerProxy(authController);

const router = Router();

const singUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  subscription: {
    type: Joi.string(),
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: Joi.string(),
});

router.post('/register', validate(singUpSchema), authControllerProxy.singUp);

const singinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
router.post('/login', validate(singinSchema), authControllerProxy.singIn);

router.get('/current', authorizeWithCookies, authControllerProxy.getLoggetUser);

router.post('/logout', authorizeWithCookies, authControllerProxy.logout);

exports.authRouter = router;
