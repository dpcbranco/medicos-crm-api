import { getMedico } from '../controller/medicos';

const router = require('express').Router();

router.get('/:crm/:uf', getMedico);

module.exports = router;