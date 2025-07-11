const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const Panel = require('../models/Panel');

// Liste panneaux utilisateur
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const panels = await Panel.find({ createdBy: req.session.user._id });
    res.render('panel/panels.html', { panels, user: req.session.user });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

// Détails panneau
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const panel = await Panel.findById(req.params.id);
    if (!panel) return res.status(404).send('Panneau non trouvé');
    if (panel.createdBy.toString() !== req.session.user._id) return res.status(403).send('Accès refusé');

    res.render('panel/panel-details.html', { panel, user: req.session.user });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
