'use strict';

const models = require('../models');

const { session } = require('../config'),
    { error } = require('../helpers');

class Controller {
    async register(req, res, next) {
        const {
            device,
            body: { id, data },
        } = req;

        try {
            if (device) {
                throw error.badRequest('Already registered');
            }

            if (!data) {
                throw error.badRequest('Missing input data');
            }

            const { meta: { name = null, type = null } = {} } = data;

            const instance = {
                id,
                name,
                type,
            };

            await models.Device.create(instance);

            return res.status(201).end();
        } catch (err) {
            next(err);
        }
    }

    async listen(req, res, next) {
        const { device } = req;

        try {
            if (!device) {
                throw error.unauthorized('Not registered');
            }

            const { id } = device;

            const key = _generateRandomKey();

            await models.Device.update(
                { key },
                {
                    where: { id },
                }
            );

            req.session.token = {
                sourceId: id,
            };

            return res.status(200).json({ key });
        } catch (err) {
            next(err);
        }
    }

    async stop(req, res, next) {
        const { device } = req;

        try {
            if (!device) {
                throw error.unauthorized('Not registered');
            }

            const { id: deviceId } = device;

            await models.DeviceController.destroy({
                where: { deviceId },
            });

            req.session.destroy((err) => {
                if (err) {
                    return next(err);
                }

                res.clearCookie(session.name);

                return res.status(204).end();
            });
        } catch (err) {
            next(err);
        }
    }

    async getControllers(req, res, next) {
        const { id } = req.params;

        try {
            const device = await models.Device.findOne({
                where: { id },
            });

            if (!device) {
                throw error.badRequest('Wrong target');
            }

            const controllers = await device.getControllers();

            return res.status(200).json({
                data: controllers || [],
            });
        } catch (err) {
            next(err);
        }
    }

    async getDevice(req, res, next) {
        const { id } = req.params;

        try {
            const device = await models.Device.findOne({
                where: { id },
                raw: true,
            });

            if (!device) {
                throw error.badRequest('Wrong target');
            }

            return res.status(200).json(device);
        } catch (err) {
            next(err);
        }
    }
}

function _generateRandomKey() {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}

module.exports = new Controller();
