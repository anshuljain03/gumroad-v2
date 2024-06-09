const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uniquePermalink: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  createDate: { type: Date, default: Date.now }
});

const Purchase = mongoose.model('Purchase', purchasechaseSchema);

module.exports = Purchase;
