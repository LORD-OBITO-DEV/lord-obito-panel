const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, lowercase: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },

  // Stockage défini en Go, 0 = illimité
  storageQuotaGB: { type: Number, default: 5 },

  // CPU (%) alloué — simple int entre 1 et 100
  cpuQuotaPercent: { type: Number, default: 10 },

  // Durée de validité du panel (en jours)
  panelDurationDays: { type: Number, default: 30 },

  // Date de création du compte / panel
  createdAt: { type: Date, default: Date.now },

  // Date d'expiration calculée selon panelDurationDays
  expiresAt: { type: Date }
});

// Middleware pour calculer la date d'expiration à la création/modification
UserSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + this.panelDurationDays * 24 * 60 * 60 * 1000);
  }
  next();
});

// Méthode pour définir le mot de passe
UserSchema.methods.setPassword = async function(password) {
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(password, salt);
};

// Méthode pour vérifier le mot de passe
UserSchema.methods.validatePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
