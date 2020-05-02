import { MODEL } from '../constants';
import { Sequelize, DataTypes } from 'sequelize';

module.exports = (sequelize: Sequelize) => {
  const deviceController = sequelize.define(MODEL.DEVICE_CONTROLLER, {
    deviceId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Devices',
        key: 'id',
      },
    },
    controllerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Controllers',
        key: 'id',
      },
    },
  });

  return deviceController;
};
