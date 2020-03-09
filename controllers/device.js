'use strict';

const models = require('../models');

const deviceService = require('../services/device');

class Controller {
    async register(req, res, next) {
        const { 
            device,
            body: {
                id, meta
            } 
        } = req;
        
        try {
            if(device) {
                throw new Error('400, Already registered');
            }

            const key = _generateRandomKey();

            await models.Device.create({
                id, key, ... meta
            });
        } catch (err) {
            next(err);
        }
    }

    async listen(req, res, next) {
        try {   
            const device = req.device;
            if(!device) {
                throw new Error('401, Not registered');
            }

            const { id, key } = device;
            
            req.session.token = {
                sourceId: id
            };

            return res.status(200).json({ key });
        } catch (err) {
            next(err);
        }
    }

    async stop(req, res, next) {
        
    }

    async getControllers(req, res, next) {
        const { id } = req.params;

        try {
            const device = id ?
                await deviceService.getDeviceById(id) :
                req.device
            
            if(!device) {
                throw new Error('400, Bad request');
            }

            const controllers = await device.getControllers();

            return res.status(200).json({ data: controllers || [] });
        } catch (err) {
            next(err);
        }
    }
}

function _generateRandomKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = new Controller();