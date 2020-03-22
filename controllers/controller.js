'use strict';

const models = require('../models');

const { session } = require('../config')
    , { error } = require('../helpers');

const controllerService = require('../services/controller');

class Controller {
    async register(req, res, next) {
        const { 
            controller,
            ip,
            body: {
                id, meta
            } 
        } = req;

        try {
            if(controller) {
                throw new Error('400, Already registered');
            }

            await models.Controller.create({
                id, ip, ... meta
            });

            return res.status(201).json({ payload: 'OK' });
        } catch (err) {
            next(err);
        }
    }

    async bind(req, res, next) {
        const { key } = req.body;
        
        try {   
            const { controller } = req;
            if(!controller) {
                throw error.unauthorized('Not registered');
            }
            
            const device = await models.Device.findOne({
                where: { key },
                attributes: [ 'id', 'name', 'ip' ]
            });

            if(!device) {
                throw error.badRequest('Wrong target');
            }

            const hasController = await device.hasController(controller);
            if(hasController) {
                throw error.badRequest('Already linked...');
            }

            await device.addController(controller);
            
            req.session.cookie.path = `/${ device.id }/`
            req.session.token = {
                sourceId: controller.id,
                targetId: device.id
            };

            const { dataValues } = device;

            return res.status(200).json({
                device: dataValues
            });
        } catch (err) {
            next(err);
        }
    }

    async unbind(req, res, next) {
        const {
            body: { key },
            controller
        } = req;
        
        try {   
            if(!controller) {
                throw error.unauthorized('Not registered');
            }
            
            const device = await models.Device.findOne({
                where: { key },
                attributes: [ 'id' ]
            });

            if(!device) {
                throw error.badRequest('Wrong target');
            }

            await device.removeController(controller);
            
            req.session.destroy((err) => { 
                if(err) {
                    return next(err);
                }

                res.clearCookie(session.name);

                return res.status(200).json({ payload: 'OK' });
            });
        } catch (err) {
            next(err);
        }
    }

    async getDevices(req, res, next) {
        const { id } = req.params;

        try {
            const controller = id ?
                await controllerService.getControllerById(id) :
                req.controller
            
            if(!controller) {
                throw error.badRequest('Wrong target');
            }

            const devices = await controller.getDevices();

            return res.status(200).json({
                data: devices || [] 
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new Controller();