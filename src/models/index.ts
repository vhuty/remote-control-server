import config from '../config';
import pg from '../database/pg';
import { __associate } from '../database/associations';

import { DeviceFactory } from './device';
import { ControllerFactory } from './controller';
import { CommandFactory } from './command';

const { sequelize, Sequelize, Op } = pg(config.pg);

const Device = DeviceFactory(sequelize);
const Controller = ControllerFactory(sequelize);
const Command = CommandFactory(sequelize);

__associate(sequelize);

export { sequelize, Sequelize, Op, Device, Controller, Command };
