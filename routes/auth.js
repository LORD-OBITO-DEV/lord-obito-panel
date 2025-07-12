const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Page de connexion
router.get('/login', (req, res) => {
  res.render('auth/login.html');
});

// Traitement de la connexion
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Debug temporaire (à supprimer en prod)
  console.log("Tentative de connexion →", {
    form: { username, password },
    env: {
      ADMIN_USERNAME: process.env.ADMIN_USERNAME,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
    }
  });

  // Connexion admin
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.user = {
      username,
      role: 'admin'
    };
    return res.redirect('/admin/dashboard');
  }

  // Connexion utilisateur normal
  const user = await User.findOne({ username });
  if (user && user.password === password) {
    req.session.user = {
      id: user._id,
      username: user.username,
      role: 'user'
    };
    return res.redirect('/user/dashboard');
  }

  // Échec d'authentification
  res.render('auth/login.html', {
    error: 'Nom d’utilisateur ou mot de passe incorrect'
  });
});

// Déconnexion
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
