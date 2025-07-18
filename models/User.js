const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  storageQuota: { type: Number, default: 5 }, // quota de stockage en Go
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
