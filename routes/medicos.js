const router = require('express').Router();

router.get('/:crm', (req, res) => res.send({message: "Hello nurse!"}));

module.exports = router