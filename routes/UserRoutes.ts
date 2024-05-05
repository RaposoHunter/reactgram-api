import { Router } from "express";
import authenticate from "../middlewares/Authenticate.js";
import { find, profile, update } from "../controllers/UserController.js";
import { userUpdateValidation } from "../middlewares/UserValidations.js";
import validate from "../middlewares/HandleValidation.js";
import upload from "../middlewares/ImageUpload.js";

const router = Router();

router.get('/profile', authenticate, profile as any);
router.put('/', authenticate, userUpdateValidation(), validate, upload.single('profileImage'), update);
router.get('/:id', find);

export default router;