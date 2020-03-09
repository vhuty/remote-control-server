'use strict';

const { MODEL } = require('../constants');

module.exports = (sequelize, DataTypes) => {
	const deviceController = sequelize.define(
		MODEL.DEVICE_CONTROLLER, {
			deviceId: {
				type: DataTypes.INTEGER,
                references: {
                    model: 'Devices',
                    key: 'id'
                }
			},
			controllerId: {
				type: DataTypes.INTEGER,
                references: {
                    model: 'Controllers',
                    key: 'id'
                }
			}
		}
	);

	return deviceController;
};
