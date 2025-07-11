function isUser(req, res, next) {
  if (req.session && req.session.user && !req.session.user.isAdmin) {
    return next();
  }
  res.status(403).send('Accès refusé. Utilisateur uniquement.');
}

module.exports = { isUser };
