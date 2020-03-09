'use strict';

const { Router } = require('express');

const device = require('../controllers/device');

const router = Router();

router.post('/', device.register);
router.post('/listen', device.listen);

router.get('/:id/controllers/', device.getControllers);

module.exports = router;