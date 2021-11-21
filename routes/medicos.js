const { getMedico, createMedico } = require('../controllers/medicos');

const router = require('express').Router();

router.get('/:crm/:uf', getMedico);
router.post('', createMedico);

module.exports = router;