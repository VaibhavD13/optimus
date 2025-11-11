const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/jobs', require('./jobs'));
router.use('/applications', require('./applications'));
router.use('/oauth', require('./oauth'));
router.use('/', require('./misc')); // contact at /api/v1/contact

router.get('/', (req, res) => res.json({ message: 'Optimus API v1' }));

module.exports = router;