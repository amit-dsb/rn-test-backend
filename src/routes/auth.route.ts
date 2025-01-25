import { login, register } from '../controllers/auth.controller';
import express from 'express';

const router = express();

router.route('/login').post(login);
router.route('/register').post(register);

export default router;