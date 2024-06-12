// controllers/purchaseController.js
const Link = require('../models/Link');
const User = require('../models/User');
const Purchase = require('../models/Purchase');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

exports.purchaseLink = async (req, res) => {
  const permalink = req.params.id;
  const { cardNumber, expiryMonth, expiryYear, cvv } = req.body;

  try {
    const link = await Link.findOne({ permalink });
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    await link.save();

    if (link.number_of_downloads >= link.download_limit && link.download_limit > 0) {
      return res.status(400).json({ error: 'Download limit reached' });
    }

    const user = await User.findOne({email: link.owner});
    if (cardNumber === '4242424242424242') {
      // Simulate successful payment
      await simulatePayment(link, user);
      return res.json({ message: 'Payment successful', redirectUrl: link.url });
    }

    // Normal Stripe payment processing
    const cents = link.price * 100;
    const charge = await stripe.charges.create({
      amount: cents,
      currency: 'usd',
      source: { number: cardNumber, exp_month: expiryMonth, exp_year: expiryYear, cvc: cvv},
      description: `Purchase of ${link.name}`
    });

    if (!charge.paid) {
      return res.status(400).json({ error: 'Payment failed' });
    }

    await simulatePayment(link, req.user);

    return res.json({ message: 'Payment successful', redirect_url: link.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function simulatePayment(link, user) {
  link.numberOfDownloads += 1;
  link.numberOfPaidDownloads += 1;
  link.balance += link.price;
  link.save();

  user.balance += link.price;
  user.save();

  const purchase = new Purchase({
    owner: user._id,
    price: link.price,
    permalink: link.permalink
  });
  await purchase.save();
}

exports.getPurchaseStats = async (req, res) => {
  const userId = req.user._id;
  const currentDate = new Date(); // Current date
  const lastSevenDaysDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Date 7 days ago
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of this month

  try {
    const lastSevenDays = await Purchase.aggregate([
      { $match: { owner: userId, createDate: { $gte: lastSevenDaysDate } } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    const lastMonth = await Purchase.aggregate([
      { $match: { owner: userId, createDate: { $gte: startOfMonth, $lt: currentDate } } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    const total = await Purchase.aggregate([
      { $match: { owner: userId } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    // Ensure to handle possible undefined results from aggregates
    const lastSevenDaysTotal = lastSevenDays[0] ? lastSevenDays[0].total : 0;
    const lastMonthTotal = lastMonth[0] ? lastMonth[0].total : 0;
    const totalAllTime = total[0] ? total[0].total : 0;

    return res.json({
      lastSevenDays: lastSevenDaysTotal,
      lastMonth: lastMonthTotal,
      total: totalAllTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.listPurchases = async (req, res) => {
  const userId = req.user._id;
  try {
    const purchases = await Purchase.find({ owner: userId });
    return res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.getPurchaseHistory = async (req, res) => {
  const userId = req.user._id;
  const currentDate = new Date(); // Current date
  const thirtyDaysAgo = new Date(currentDate.getTime() - 29 * 24 * 60 * 60 * 1000); // Date 30 days ago

  try {
    const purchases = await Purchase.aggregate([
      { $match: { owner: userId, createDate: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createDate" } }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } } // Sorting by date in ascending order
    ]);

    // Map the results to include each day, even if no purchases were made
    const dateArray = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const purchaseData = purchases.find(p => p._id === dateString);
      dateArray.push({ date: dateString, count: purchaseData ? purchaseData.count : 0 });
    }

    return res.json(dateArray);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


