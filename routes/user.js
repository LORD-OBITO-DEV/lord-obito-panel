const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const User = require('../models/User');
const File = require('../models/File');

// Dashboard utilisateur
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.session.user.username });
    const used = (await File.aggregate([
      { $match: { username: user.username } },
      { $group: { _id: null, total: { $sum: "$size" } } }
    ]))[0]?.total || 0;

    const files = await File.find({ username: user.username }).sort({ uploadDate: -1 });
    res.render('user/dashboard_user.html', { user, used, files });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

// Paramètres utilisateur
router.get('/settings', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.session.user.username });
    const used = (await File.aggregate([
      { $match: { username: user.username } },
      { $group: { _id: null, total: { $sum: "$size" } } }
    ]))[0]?.total || 0;

    res.render('user/settings.html', { user, used });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
