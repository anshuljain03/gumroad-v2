const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  uniquePermalink: { type: String, required: true },
  blobKey: String,
  fileName: String,
  fileType: String,
  date: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
