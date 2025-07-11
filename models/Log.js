const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  username: { type: String, required: true }, // utilisateur lié au log
  action: { type: String, required: true }, // description de l'action
  timestamp: { type: Date, default: Date.now },
  ip: { type: String }, // optionnel : adresse IP de l'action
});

module.exports = mongoose.model('Log', logSchema);
