const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Page login
router.get('/login', (req, res) => {
  res.render('auth/login.html');
});

// POST login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.render('auth/login.html', { error: 'Utilisateur non trouvé' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render('auth/login.html', { error: 'Mot de passe incorrect' });

    req.session.user = { _id: user._id, username: user.username, isAdmin: user.isAdmin };
    res.redirect(user.isAdmin ? '/admin/dashboard' : '/dashboard');
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Register Admin (optional)
router.get('/register-admin', (req, res) => {
  res.render('auth/register-admin.html');
});

router.post('/register-admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, isAdmin: true });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
