const express = require('express');
const router = express.Router();
const { uploadFile, uploadStrategy } = require('../controllers/fileController');

router.post('/', uploadStrategy, uploadFile);

module.exports = router;
