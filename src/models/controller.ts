import {
  Sequelize,
  BuildOptions,
  DataTypes,
  Model,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyAddAssociationMixin,
} from 'sequelize';

import { MODEL } from '../constants';
import { Device } from './device';

export class Controller extends Model {
  id!: string;
  name: string;
  ip?: string;
  getDevices: BelongsToManyGetAssociationsMixin<Device>;
  addDevice: BelongsToManyAddAssociationMixin<Device, string>;
  hasDevice: BelongsToManyHasAssociationMixin<Device, string>;
}

type ControllerStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Controller;
};

export const ControllerFactory = (sequelize: Sequelize) => {
  return <ControllerStatic>sequelize.define(MODEL.CONTROLLER, {
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
};
