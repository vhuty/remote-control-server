'use strict';

const { Router } = require('express');

const device = require('../controllers/device');

const router = Router();

router.post('/', device.register);
router.put('/listen', device.listen);
router.put('/stop', device.stop);

router.get('/:id/controllers/', device.getControllers);

module.exports = router;