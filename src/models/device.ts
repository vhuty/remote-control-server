import {
  Sequelize,
  BuildOptions,
  DataTypes,
  Model,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  HasManyGetAssociationsMixin,
} from 'sequelize';

import { Status, MODEL } from '../constants';
import { Controller } from './controller';
import { Command } from './command';

export class Device extends Model {
  id!: string;
  ip?: string;
  key?: string;
  name: string;
  type: string;
  status!: string;
  getControllers: BelongsToManyGetAssociationsMixin<Controller>;
  removeController: BelongsToManyRemoveAssociationMixin<Controller, string>;
  getCommands: HasManyGetAssociationsMixin<Command>;
}

type DeviceStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Device;
};

export const DeviceFactory = (sequelize: Sequelize) => {
  return <DeviceStatic>sequelize.define(MODEL.DEVICE, {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    ip: {
      type: DataTypes.STRING,
    },
    key: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: Status.OFFLINE,
    },
  });
};
