// routes/admin.js

const express = require('express');
const router = express.Router();
const { isAdmin, isAuthenticated } = require('../middlewares/auth');
const User = require('../models/User');
const Panel = require('../models/Panel');

// Dashboard admin
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    const panels = await Panel.find();
    const totalUsedStorage = panels.reduce((acc, panel) => acc + (panel.usedStorage || 0), 0);
    const lastUser = users.length > 0 ? users[users.length - 1] : null;

    const stats = {
      totalUsers: users.length,
      totalPanels: panels.length,
      totalUsedStorage,
      lastUser
    };

    res.render('admin/dashboard.html', { stats, user: req.session.user });
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

// Page de création d’un panneau
router.get('/create-panel', isAdmin, (req, res) => {
  res.render('admin/create-panel.html', { user: req.session.user });
});

// Création d’un panneau
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

// Liste des panneaux
router.get('/panels', isAdmin, async (req, res) => {
  try {
    const panels = await Panel.find();
    res.render('admin/panels.html', { panels, user: req.session.user });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

// Détails d’un panneau
router.get('/panels/:id', isAdmin, async (req, res) => {
  try {
    const panel = await Panel.findById(req.params.id);
    if (!panel) return res.status(404).send('Panneau introuvable');
    res.render('admin/panel-details.html', { panel, user: req.session.user });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

// Suppression d’un panneau
router.post('/panels/:id/delete', isAdmin, async (req, res) => {
  try {
    await Panel.findByIdAndDelete(req.params.id);
    res.redirect('/admin/panels');
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
