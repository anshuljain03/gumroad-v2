const mongoose = require('mongoose');

const permalinkSchema = new mongoose.Schema({
  permalink: { type: String, required: true, unique: true }
});

const Permalink = mongoose.model('Permalink', permalinkSchema);

module.exports = Permalink;
