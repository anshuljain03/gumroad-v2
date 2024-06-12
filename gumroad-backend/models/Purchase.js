const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  permalink: { type: String, required: true },
  price: { type: Number, required: true },
  createDate: { type: Date, default: Date.now }
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
