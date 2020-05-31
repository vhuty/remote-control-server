import { Request, Response, NextFunction } from 'express';

import { Device, Controller } from '../models';

const controllerRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.body;

  if (id) {
    try {
      const controller = await Controller.findOne({
        where: { id },
      });

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
      const device = await Device.findOne({
        where: { id },
      });

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
