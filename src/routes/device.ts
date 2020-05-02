import { Router } from 'express';

import device from '../controllers/device';

const router = Router();

router.post('/', device.register);
router.put('/listen', device.listen);
router.put('/stop', device.stop);
router.get('/:id/controllers/', device.getControllers);
router.get('/:id/', device.getDevice);

export default router;
