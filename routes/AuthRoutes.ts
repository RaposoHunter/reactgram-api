import express from 'express';
import { register, login, profile, update } from '../controllers/UserController.js';
import validate from '../middlewares/HandleValidation.js';
import { userCreateValidation, loginValidation, userUpdateValidation } from '../middlewares/UserValidations.js';
import authenticate from '../middlewares/Authenticate.js';
import upload from '../middlewares/ImageUpload.js';

const router = express.Router();

router.post('/register', userCreateValidation(), validate, register);
router.post('/login', loginValidation(), validate, login);
router.get('/profile', authenticate, profile as any);
router.put('/', authenticate, userUpdateValidation(), validate, upload.single('profile'), update)

export default router;