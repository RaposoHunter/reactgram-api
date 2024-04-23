import { Router } from 'express';
import { register, login } from '../controllers/UserController.js';
import validate from '../middlewares/HandleValidation.js';
import { userCreateValidation, loginValidation } from '../middlewares/UserValidations.js';

const router = Router();

router.post('/register', userCreateValidation(), validate, register);
router.post('/login', loginValidation(), validate, login);

export default router;