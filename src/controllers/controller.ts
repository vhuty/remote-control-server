import { Request, Response, NextFunction } from 'express';

import models from '../models';
import { badRequest, unauthorized, alreadyExists } from '../helpers/error';

class Controller {
  async register(req: Request, res: Response, next: NextFunction) {
    const {
      //@ts-ignore
      controller,
      body: { id, data },
    } = req;

    try {
      if (controller) {
        throw alreadyExists('Already registered');
      }

      if (!data) {
        throw badRequest('Missing input data');
      }

      const { meta: { name = null } = {} } = data;

      const instance = { id, name, };

      //@ts-ignore
      await models.Controller.create(instance);

      return res.status(201).end();
    } catch (err) {
      next(err);
    }
  }

  async sync(req: Request, res: Response, next: NextFunction) {
    const {
      //@ts-ignore
      controller,
    } = req;

    if (!controller) {
      throw unauthorized('Not registered');
    }

    const devices = await controller.getDevices();
    const targets = devices.map(({ id }) => id);

    req.session.token = {
      source: controller.id,
      targets,
    };

    return res.status(204).end();
  }

  async bind(req: Request, res: Response, next: NextFunction) {
    const {
      body: { key },
      //@ts-ignore
      controller,
    } = req;

    try {
      if (!controller) {
        throw unauthorized('Not registered');
      }

      //@ts-ignore
      const device = await models.Device.findOne({
        where: { key },
      });

      /* If no devices found by specified access key */
      if (!device) {
        throw badRequest('Wrong target');
      }

      const hasDevice = await controller.hasDevice(device);
      if (hasDevice) {
        throw badRequest('Already linked...');
      }

      await controller.addDevice(device);

      return res.status(200).json(device);
    } catch (err) {
      next(err);
    }
  }

  async unbind(req: Request, res: Response, next: NextFunction) {
    const {
      body: { key },
      //@ts-ignore
      controller,
    } = req;

    try {
      if (!controller) {
        throw unauthorized('Not registered');
      }

      //@ts-ignore
      const device = await models.Device.findOne({
        where: { key },
      });

      if (!device) {
        throw badRequest('Wrong target');
      }

      await device.removeController(controller);

      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  async getDevices(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      //@ts-ignore
      const controller = await models.Controller.findOne({
        where: { id },
      });

      if (!controller) {
        throw badRequest('Wrong target');
      }

      const devices = await controller.getDevices();

      return res.status(200).json(devices || []);
    } catch (err) {
      next(err);
    }
  }

  async getController(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      //@ts-ignore
      const controller = await models.Controller.findOne({
        where: { id },
        raw: true,
      });

      if (!controller) {
        throw badRequest('Wrong target');
      }

      return res.status(200).json(controller);
    } catch (err) {
      next(err);
    }
  }
}

export default new Controller();
