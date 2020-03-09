'use strict';

const { MODEL } = require('../constants');

module.exports = (sequelize, DataTypes) => {
	const device = sequelize.define(
		MODEL.CONTROLLER, {
			id: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true
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
