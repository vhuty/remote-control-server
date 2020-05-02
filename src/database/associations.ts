import { Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  const { Device, Controller } = sequelize.models;

  Device.belongsToMany(Controller, {
    through: 'DeviceController',
    foreignKey: 'deviceId',
  });

  Controller.belongsToMany(Device, {
    through: 'DeviceController',
    foreignKey: 'controllerId',
  });
};
