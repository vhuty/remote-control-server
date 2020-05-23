import { Request, Response, NextFunction } from 'express';

import models from '../models';
import config from '../config';
import { badRequest, unauthorized, alreadyExists } from '../helpers/error';

class Controller {
  async register(req: Request, res: Response, next: NextFunction) {
    const {
      //@ts-ignore
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

      const instance = { id, name, type, };

      //@ts-ignore
      await models.Device.create(instance);

      return res.status(201).end();
    } catch (err) {
      next(err);
    }
  }

  async listen(req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    const { device } = req;

    try {
      if (!device) {
        throw unauthorized('Not registered');
      }

      const { id } = device;
      const key = _generateRandomKey();

      //@ts-ignore
      await models.Device.update(
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
    //@ts-ignore
    const { device } = req;

    try {
      if (!device) {
        throw unauthorized('Not registered');
      }

      const { id } = device;

      //@ts-ignore
      await models.Device.update(
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
      //@ts-ignore
      const device = await models.Device.findOne({
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

  async getDevice(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      //@ts-ignore
      const device = await models.Device.findOne({
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

export default new Controller();
