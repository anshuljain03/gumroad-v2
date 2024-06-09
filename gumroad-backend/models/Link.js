const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  uniquePermalink: { type: String, required: true },
  url: { type: String, required: true },
  previewUrl: String,
  description: String,
  price: { type: Number, required: true, default: 1.00 },
  createDate: { type: Date, default: Date.now },
  lengthOfExclusivity: { type: Number, default: 0 },
  numberOfPaidDownloads: { type: Number, default: 0 },
  numberOfDownloads: { type: Number, default: 0 },
  downloadLimit: { type: Number, default: 0 },
  numberOfViews: { type: Number, default: 0 },
  balance: { type: Number, default: 0.00 }
});

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
