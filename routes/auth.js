const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Page login
router.get('/login', (req, res) => {
  res.render('auth/login.html', { error: null });
});

// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) return res.render('auth/login.html', { error: 'Utilisateur non trouvé' });

  const valid = await user.validatePassword(password);
  if (!valid) return res.render('auth/login.html', { error: 'Mot de passe incorrect' });

  // Save user in session (sans password hash)
  req.session.user = {
    id: user._id,
    username: user.username,
    isAdmin: user.isAdmin
  };

  if (user.isAdmin) {
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/user/dashboard');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

// Route register (uniquement pour création admin via URL secrète)
router.get('/register-admin', (req, res) => {
  res.render('auth/register-admin.html', { error: null });
});

router.post('/register-admin', async (req, res) => {
  const { username, email, password, secretKey } = req.body;

  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'change_me';

  if (secretKey !== ADMIN_SECRET) return res.render('auth/register-admin.html', { error: 'Clé secrète invalide' });

  if (await User.findOne({ username })) return res.render('auth/register-admin.html', { error: 'Utilisateur déjà existant' });

  const user = new User({ username, email, isAdmin: true, storageQuotaGB: 0, cpuQuotaPercent: 100, panelDurationDays: 3650 });
  await user.setPassword(password);
  await user.save();

  res.redirect('/auth/login');
});

module.exports = router;
