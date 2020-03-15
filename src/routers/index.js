// @flow

import { Router } from 'express';

import { registerValidators, updateValidators } from 'validators/userValidators';
import { getUser, registerUser, updateUser } from 'controllers/userController';
import { responseMiddleware } from 'middlewares/responseMiddleware';

import type { Router as RouterType, $Request, $Response } from 'express';

const router: RouterType<*> = Router();

router.get('/', (req: $Request, res: $Response) => console.log('hello world', req, res));
router.get('/user', getUser, responseMiddleware);
router.post('/user', registerValidators, registerUser, responseMiddleware);
router.put('/user', updateValidators, updateUser, responseMiddleware);

export default router;
