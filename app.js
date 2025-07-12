const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connecté à MongoDB');
}).catch((err) => {
  console.error('❌ Erreur MongoDB :', err);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));

// Configuration du moteur de template
app.engine('html', require('ejs').renderFile); // supporte les .html avec EJS
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Fichiers statiques (public/)
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/logo.png', express.static(path.join(__dirname, 'public/logo.png')));

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const panelRoutes = require('./routes/panel');

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/panel', panelRoutes);

// Redirection par défaut
app.get('/', (req, res) => {
  if (req.session.user && req.session.user.role === 'admin') {
    res.redirect('/admin/dashboard');
  } else if (req.session.user) {
    res.redirect('/user/dashboard');
  } else {
    res.redirect('/login');
  }
});

// Pages d’erreur
app.use((req, res) => {
  res.status(404).render('errors/404.html');
});

app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur :', err.stack);
  res.status(500).render('errors/500.html');
});

// Démarrage
app.listen(PORT, () => {
  console.log(`🚀 LORD OBITO PANEL en ligne sur http://localhost:${PORT}`);
});
