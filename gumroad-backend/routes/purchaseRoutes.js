const express = require('express');
const router = express.Router();
const { purchaseLink, getPurchaseStats, listPurchases, getPurchaseHistory } = require('../controllers/purchaseController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, listPurchases);
router.get('/stats', protect, getPurchaseStats);
router.get('/history', protect, getPurchaseHistory);

router.route('/:id')
  .post(purchaseLink);

  module.exports = router;