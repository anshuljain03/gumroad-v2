const mongoose = require('mongoose');
const crypto = require('crypto'); 

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  paymentAddress: { type: String, default: "" },
  name: { type: String, default: "" },
  password: { type: String, required: true },
  resetPasswordToken: { type: String, default: "" },
  resetPasswordExpire: {type: Date, default: null},
  createDate: { type: Date, default: Date.now },
  balance: { type: Number, default: 0.00 }
});

userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
