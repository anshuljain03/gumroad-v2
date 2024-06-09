const Link = require('../models/Link');

exports.getLinks = async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.id });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.json(link);
  } catch (err) {
  res.status(500).json({ message: err.message });
  }
};

exports.createLink = async (req, res) => {
  const { name, url, description, price } = req.body;

  try {
    const link = new Link({
      owner: req.user.id,
      name,
      url,
      description,
      price
    });

    await link.save();
    res.status(201).json(link);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    const updatedLink = await Link.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(updatedLink);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    await link.remove();
    res.json({ message: 'Link deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
