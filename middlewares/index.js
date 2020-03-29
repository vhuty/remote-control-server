'use strict';

const models = require('../models');

const controllerRequired = async (req, res, next) => {
    const { id } = req.body;

    if(id) {
        try {
            const controller = await models.Controller.findOne({
                where: { id }
            });
        
            req.controller = controller;
        } catch (err) {
            next(err);
        }
    }

    return next();
}

const deviceRequired = async (req, res, next) => {
    const { id } = req.body;

    if(id) {
        try {
            const device = await models.Device.findOne({
                where: { id }
            });
        
            req.device = device;
        } catch (err) {
            next(err);
        }
    }

    return next();
}

const errorHandler = (err, req, res, next) => {
    const response = {
        message: 'Something went wrong...',
        status: 500
    };

    if(err instanceof Error) {
        //TODO: enable logs

        console.error(err);
    } else {
        const { status, message } = err;

        response.status = status;
        response.message = message;
    }

    res.status(response.status).json(response);
}

module.exports = {
    controllerRequired,
    deviceRequired,
    errorHandler
}