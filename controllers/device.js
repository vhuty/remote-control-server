'use strict';

const models = require('../models');

const { error } = require('../helpers');

class Controller {
    async register(req, res, next) {
        const { 
            device,
            body: {
                id,
                data
            } 
        } = req;
        
        try {
            if(device) {
                throw error.badRequest('Already registered');
            }

            if(!data) {
                throw error.badRequest('Missing input data');
            }

            const {
                meta: {
                    name = null,
                    type = null
                } = {}
            } = data;

            const instance = {
                id, name, type
            }

            await models.Device.create(instance);

            return res.status(201).json({
                payload: 'OK'
            });
        } catch (err) {
            next(err);
        }
    }

    async listen(req, res, next) {
        try {   
            const { device } = req;

            if(!device) {
                throw error.unauthorized('Not registered');
            }

            const { id } = device;

            const key = _generateRandomKey();

            await models.Device.update({ key }, {
                where: { id }
            });
            
            req.session.token = {
                sourceId: id
            };

            return res.status(200).json({ key });
        } catch (err) {
            next(err);
        }
    }

    async getControllers(req, res, next) {
        const { id } = req.params;

        try {
            const device = id ?
                await deviceService.getDeviceById(id) :
                req.device
            
            if(!device) {
                throw error.badRequest('Missing device entity');
            }

            const controllers = await deviceService.getControllersById(device.id);

            return res.status(200).json({ 
                data: controllers || [] 
            });
        } catch (err) {
            next(err);
        }
    }
}

function _generateRandomKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = new Controller();