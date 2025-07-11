const mongoose = require('mongoose');

const panelSchema = new mongoose.Schema({
  panelName: { type: String, required: true, unique: true },
  username: { type: String, required: true }, // utilisateur propriétaire du panel
  storageLimitGB: { type: Number, required: true }, // en Go, 0 ou null = illimité
  cpuLimit: { type: String, default: '1 CPU' }, // ex: "1 CPU", "2 CPUs", "illimité"
  durationDays: { type: Number, required: true }, // durée en jours (7, 30, etc.)
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('Panel', panelSchema);
