const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../users/user.model');

const saltRaunds = 7;

exports.singUp = async (req, res, next) => {
  // 1. validate req body
  // 2. check if user with such email exists
  // 3. if exists - throw 409 error
  // 4. if no exists - create new user
  // 5. return successfull response 201
  // res.send('Hello post-gad');
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).send('Email in use');
  }

  const passwordHash = await bcryptjs.hash(password, saltRaunds);
  const newUser = await User.create({
    email,
    passwordHash,
  });
  return res.status(201).send({
    email,
    subscription: 'free',
  });
};

exports.singIn = async (req, res, next) => {
  // 1. validate req body
  // 2. find user with provided email
  // 3. if user not found throw 401 error
  // 4. compare provided password and DB passwordHash
  // 5. if password is incorrect - throw 401 error
  // 6. generet auth token
  // 7. return successfull response

  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send('Email or password is wrong');
  }
  const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).send('Authentication failed');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie('token', token, { httpOnly: true });

  return res.status(200).send({ token, email, subscription });
};

exports.getLoggetUser = (req, res) => {
  const { email, subscription } = req.user;
  return res.status(200).send({ email, subscription });
};

exports.logout = async (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);
  if (!userId) {
    return res.status(401).send('Not authorized');
  }

  const user = await User.findByIdAndUpdate(
    {
      _id: userId,
    },
    {
      $set: {
        token: null,
      },
    },
    { new: true },
  );
  return res.status(204).send(user);
};
