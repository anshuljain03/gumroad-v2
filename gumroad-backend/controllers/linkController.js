const Link = require('../models/Link');
const Permalink = require('../models/Permalink');

exports.getLinks = async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.email });
    console.log('links', links);
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLink = async (req, res) => {
  console.log(req.params.id);
  try {
    const link = await Link.find({permalink: req.params.id});

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.json(link[0]);
  } catch (err) {
  res.status(500).json({ message: err.message });
  }
};

exports.createLink = async (req, res) => {
  const { name, url, previewUrl, description, price } = req.body;
  const permalink = new Permalink({permalink: Math.random().toString(36).substring(2, 8)});

  try {
    const savedPermalink = await permalink.save();
    const link = new Link({
      owner: req.user.email,
      name,
      url,
      previewUrl,
      permalink: savedPermalink.permalink,
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
    const link = await Link.find({permalink:req.params.id});

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    const updatedLink = await Link.findOneAndUpdate({ permalink: req.params.id }, req.body, { new: true });

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
