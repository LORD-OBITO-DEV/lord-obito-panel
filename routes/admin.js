// routes/admin.js

const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/auth');
const User = require('../models/User');
const Panel = require('../models/Panel');

// Dashboard admin
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    const panels = await Panel.find();
    res.render('admin/dashboard.html', { users, panels, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Liste des utilisateurs
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.render('admin/users.html', { users, user: req.session.user });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

// Page création panneau
router.get('/create-panel', isAdmin, (req, res) => {
  res.render('admin/create-panel.html', { user: req.session.user });
});

// Création panneau (POST)
router.post('/create-panel', isAdmin, async (req, res) => {
  try {
    const { panelName, storageLimit, cpuLimit, duration, username, password } = req.body;

    const newPanel = new Panel({
      name: panelName,
      storageLimit,
      cpuLimit,
      duration,
      username,
      password,
      createdBy: req.session.user._id
    });

    await newPanel.save();
    res.redirect('/admin/panels');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Liste panneaux
router.get('/panels', isAdmin, async (req, res) => {
  try {
    const panels = await Panel.find();
    res.render('admin/panels.html', { panels, user: req.session.user });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

// Suppression panneau
router.post('/panels/:id/delete', isAdmin, async (req, res) => {
  try {
    await Panel.findByIdAndDelete(req.params.id);
    res.redirect('/admin/panels');
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
