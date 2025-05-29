


import express from 'express';
import { signup, login, verify2fa } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-2fa', verify2fa);
router.post('/login', login);

export default router;