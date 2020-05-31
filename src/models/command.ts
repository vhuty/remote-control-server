import { Sequelize, BuildOptions, DataTypes, Model } from 'sequelize';

import { MODEL } from '../constants';

export class Command extends Model {
  id?: number;
  phrase: string;
  body: string;
  defaultManner?: boolean;
}

type CommandStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Command;
};

export const CommandFactory = (sequelize: Sequelize) => {
  return <CommandStatic>sequelize.define(MODEL.COMMAND, {
    phrase: {
      type: DataTypes.STRING,
    },
    body: {
      type: DataTypes.STRING,
    },
    defaultManner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};
