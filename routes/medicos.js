import { Router } from 'express';

const router = Router();

router.get('/:crm', (req, res) => res.send({ message: 'Hello nurse!' }));

module.exports = router;