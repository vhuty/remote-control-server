import { Router } from 'express';

import {
  controllerRequired,
  deviceRequired,
  errorHandler,
} from '../middleware';

import controllerRouter from './controller';
import deviceRouter from './device';

const router = Router();

router.use('/controller', controllerRequired, controllerRouter);
router.use('/device', deviceRequired, deviceRouter);

router.use(errorHandler);

export default router;
