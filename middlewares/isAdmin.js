function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    return next();
  }
  res.status(403).send('Accès refusé. Admin uniquement.');
}

module.exports = { isAdmin };
