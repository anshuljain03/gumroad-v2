const express = require('express');
const router = express.Router();
const { uploadFile, uploadStrategy, getFileUrl, fetchFile } = require('../controllers/fileController');

router.get('/:blobName', fetchFile);
router.get('/:blobName/url', getFileUrl);
router.post('/', uploadStrategy, uploadFile);

module.exports = router;
