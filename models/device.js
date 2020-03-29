'use strict';

const { MODEL } = require('../constants');

module.exports = (sequelize, DataTypes) => {
	const device = sequelize.define(
		MODEL.DEVICE, {
			id: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true
			},
			ip: {
                type: DataTypes.STRING
            },
			key: {
				type: DataTypes.STRING
			},
			name: {
				type: DataTypes.STRING
			},
			type: {
				type: DataTypes.STRING
			}
		}
	);

	return device;
};
