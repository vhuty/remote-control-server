import { Router } from 'express';

import controller from '../controllers/controller';

const router = Router();

router.post('/', controller.register);
router.post('/sync/', controller.sync);
router.post('/bind/', controller.bind);
router.delete('/bind/', controller.unbind);
router.get('/:id/devices/', controller.getDevices);
router.get('/:id/', controller.getController);

export default router;
