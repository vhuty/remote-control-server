import { Request, Response, NextFunction } from 'express';

import { Command, Device } from '../models';
import config from '../config';
import { badRequest, unauthorized, alreadyExists } from '../helpers/error';

class CTRLDevice {
  async register(req: Request, res: Response, next: NextFunction) {
    const {
      device,
      body: { id, data },
    } = req;

    try {
      if (device) {
        throw alreadyExists('Already registered');
      }

      if (!data) {
        throw badRequest('Missing input data');
      }

      const { meta: { name = null, type = null } = {} } = data;

      const instance = { id, name, type };

      await Device.create(instance);

      return res.status(201).end();
    } catch (err) {
      next(err);
    }
  }

  async listen(req: Request, res: Response, next: NextFunction) {
    const { device } = req;

    try {
      if (!device) {
        throw unauthorized('Not registered');
      }

      const { id } = device;
      const key = _generateRandomKey();

      await Device.update(
        { key, status: 'online' },
        {
          where: { id },
        }
      );

      req.session.token = {
        source: id,
      };

      return res.status(200).json({ key });
    } catch (err) {
      next(err);
    }
  }

  async stop(req: Request, res: Response, next: NextFunction) {
    const { device } = req;

    try {
      if (!device) {
        throw unauthorized('Not registered');
      }

      const { id } = device;

      await Device.update(
        {
          key: null,
          status: 'offline',
        },
        {
          where: { id },
        }
      );

      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }

        res.clearCookie(config.session.name);

        return res.status(204).end();
      });
    } catch (err) {
      next(err);
    }
  }

  async getControllers(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const device = await Device.findOne({
        where: { id },
      });

      if (!device) {
        throw badRequest('Wrong target');
      }

      const controllers = await device.getControllers();

      return res.status(200).json({
        data: controllers || [],
      });
    } catch (err) {
      next(err);
    }
  }

  async getCommands(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const device = await Device.findOne({
        where: { id },
      });

      if (!device) {
        throw badRequest('Wrong target');
      }

      const commands = await device.getCommands();

      return res.status(200).json(commands);
    } catch (err) {
      next(err);
    }
  }

  async setCommands(req: Request, res: Response, next: NextFunction) {
    const {
      body: { data = [] },
      params: { id },
    } = req;

    try {
      const device = await Device.findOne({
        where: { id },
        raw: true,
      });

      if (!device) {
        throw badRequest('Wrong target');
      }

      if (!data) {
        throw badRequest('Missing input data');
      }

      const filtered = data.filter((cmd) => cmd.phrase && cmd.body);
      const commands = filtered.map((cmd) => ({ ...cmd, deviceId: device.id }));

      await Promise.all([
        Command.destroy({
          where: { deviceId: device.id },
        }),
        Command.bulkCreate(commands),
      ]);

      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  async getDevice(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const device = await Device.findOne({
        where: { id },
        raw: true,
      });

      if (!device) {
        throw badRequest('Wrong target');
      }

      return res.status(200).json(device);
    } catch (err) {
      next(err);
    }
  }
}

function _generateRandomKey() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export default new CTRLDevice();
