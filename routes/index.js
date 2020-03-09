'use strict';

const { Router } = require('express');

const { controllerRequired, deviceRequired, errorHandler } = require('../middlewares');

const controllerRouter = require('./controller')
    , deviceRouter = require('./device');    

const router = Router();

router.use('/controller', controllerRequired, controllerRouter);
router.use('/device', deviceRequired, deviceRouter);

router.use(errorHandler);

module.exports = router;