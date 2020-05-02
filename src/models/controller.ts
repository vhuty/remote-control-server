import { MODEL } from '../constants';
import { Sequelize, DataTypes, Model } from 'sequelize';

export default (sequelize: Sequelize) => {
  const device = sequelize.define(MODEL.CONTROLLER, {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    ip: {
      type: DataTypes.STRING,
    },
  });

  return device;
};
