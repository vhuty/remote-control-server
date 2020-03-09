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

const injectCookie = (req) => {
    const { headers, url } = req;
    if(headers.cookie) {
        return;
    }

    const params = new URLSearchParams(url.slice(1));
    const token = params.get('token');

    if(!token) {
        return;
    }

    req.headers.cookie = token;

    return req;
}

const errorHandler = (err, req, res, next) => {
    console.error(err);

    const response = {
        message: 'Something went wrong...',
        status: 500
    };

    if(!(err instanceof Error)) {
        const { status, message } = err;

        response.status = status;
        response.message = message;
    }

    res.status(response.status).json(response);
}

module.exports = {
    controllerRequired,
    deviceRequired,
    injectCookie,
    errorHandler
}