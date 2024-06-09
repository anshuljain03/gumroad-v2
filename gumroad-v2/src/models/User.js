const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  paymentAddress: { type: String, default: "" },
  name: { type: String, default: "" },
  password: { type: String, required: true },
  resetHash: { type: String, default: "" },
  createDate: { type: Date, default: Date.now },
  balance: { type: Number, default: 0.00 }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
