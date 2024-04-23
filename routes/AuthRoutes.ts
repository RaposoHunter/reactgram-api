import express from 'express';
import { register, login, profile } from '../controllers/UserController.js';
import validate from '../middlewares/HandleValidation.js';
import { userCreateValidation, loginValidation } from '../middlewares/UserValidations.js';
import authenticate from '../middlewares/Authenticate.js';

const router = express.Router();

router.post('/register', userCreateValidation(), validate, register);
router.post('/login', loginValidation(), validate, login);
router.get('/profile', authenticate, profile as any);

export default router;