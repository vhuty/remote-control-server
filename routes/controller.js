'use strict';

const { Router } = require('express');

const controller = require('../controllers/controller');

const router = Router();

router.post('/', controller.register);
router.post('/bind/', controller.bind);
router.delete('/bind/', controller.unbind);
router.get('/:id/devices/', controller.getDevices);

module.exports = router;