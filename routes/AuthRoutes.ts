import express from 'express';
import { register } from '../controllers/UserController.js';
import validate from '../middlewares/HandleValidation.js';
import { userCreateValidation } from '../middlewares/UserVallidations.js';

const router = express.Router();

router.post('/register', userCreateValidation(), validate, register);

export default router;