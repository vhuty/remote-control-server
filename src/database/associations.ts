import { Sequelize } from 'sequelize';

export const __associate = (sequelize: Sequelize) => {
  const { Device, Controller, Command } = sequelize.models;

  Device.belongsToMany(Controller, {
    through: 'DeviceController',
    foreignKey: 'deviceId',
  });

  Controller.belongsToMany(Device, {
    through: 'DeviceController',
    foreignKey: 'controllerId',
  });

  Device.hasMany(Command, { foreignKey: 'deviceId' });
};
