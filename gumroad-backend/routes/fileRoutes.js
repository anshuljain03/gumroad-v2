const express = require('express');
const router = express.Router();
const { uploadFile, uploadStrategy, getFileUrl } = require('../controllers/fileController');

router.get('/:blobName', getFileUrl);
router.post('/', uploadStrategy, uploadFile);

module.exports = router;
