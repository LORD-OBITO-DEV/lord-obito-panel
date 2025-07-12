require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const app = express();

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false
}));

// Layouts et moteur de vues HTML via EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

// Définition des routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const panelRoutes = require('./routes/panel');

app.use('/', authRoutes);            // Routes d'authentification
app.use('/admin', adminRoutes);     // Routes administrateur
app.use('/user', userRoutes);       // Routes utilisateur
app.use('/panel', panelRoutes);     // Routes panneau (upload, etc.)

// Page d'accueil -> redirige selon l'authentification
app.get('/', (req, res) => {
  if (req.session.user) {
    if (req.session.user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/user/dashboard');
    }
  }
  res.redirect('/login');
});

// Gestion erreurs 404
app.use((req, res) => {
  res.status(404).render('errors/404.html');
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 LORD OBITO PANEL en ligne sur http://localhost:${PORT}`);
});
