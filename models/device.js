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
			key: {
				type: DataTypes.STRING,
				allowNull: false
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
            },
            ip: {
                type: DataTypes.STRING,
				allowNull: false
            }
		}
	);

	return device;
};
