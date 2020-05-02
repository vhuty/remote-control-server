import { Request, Response, NextFunction } from 'express';

import models from '../models';

const controllerRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.body;

  if (id) {
    try {
      //@ts-ignore
      const controller = await models.Controller.findOne({
        where: { id },
      });

      //@ts-ignore
      req.controller = controller;
    } catch (err) {
      next(err);
    }
  }

  return next();
};

const deviceRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.body;

  if (id) {
    try {
      //@ts-ignore
      const device = await models.Device.findOne({
        where: { id },
      });

      //@ts-ignore
      req.device = device;
    } catch (err) {
      next(err);
    }
  }

  return next();
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = {
    message: 'Something went wrong...',
    status: 500,
  };

  if (err instanceof Error) {
    //TODO: enable logs

    console.error(err);
  } else {
    const { status, message } = err;

    response.status = status;
    response.message = message;
  }

  res.status(response.status).json(response);
};

export { controllerRequired, deviceRequired, errorHandler };
