const mongoose = require('mongoose');
const { Schema } = mongoose;

const usersSchema = new Schema({
  // username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: { type: String },
});

exports.User = mongoose.model('User', usersSchema);
