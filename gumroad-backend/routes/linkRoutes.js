const express = require('express');
const router = express.Router();
const { getLinks, getLink, createLink, updateLink, deleteLink } = require('../controllers/linkController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getLinks)
  .post(protect, createLink);

router.route('/:id')
  .get(protect, getLink)
  .put(protect, updateLink)
  .delete(protect, deleteLink);

module.exports = router;
