const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  username: { type: String, required: true },
  action: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);
