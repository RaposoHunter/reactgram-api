import { Router } from "express";
import { validatePhotoComment, validatePhotoStore, validatePhotoUpdate } from "../middlewares/ValidatePhoto.js";
import authenticate from "../middlewares/Authenticate.js";
import validate from "../middlewares/HandleValidation.js";
import upload from "../middlewares/ImageUpload.js";
import { destroy, find, fromUser, index, like, search, store, storeComment, update } from "../controllers/PhotoController.js";
import { Request, Response } from "express";

type BaseHandler = (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;

const router = Router();

router.get('/', authenticate, index as BaseHandler);
router.get('/search', authenticate, search as BaseHandler);
router.get('/:id', authenticate, find as BaseHandler);
router.post('/', authenticate, upload.single('image'), validatePhotoStore(), validate, store as BaseHandler);
router.put('/:id', authenticate, upload.single('image'), validatePhotoUpdate(), validate, update as BaseHandler);
router.delete('/:id', authenticate, destroy as BaseHandler);

router.get('/user/:id', authenticate, fromUser as BaseHandler);

router.put('/:id/like', authenticate, like as BaseHandler);

router.post('/:id/comments', authenticate, validatePhotoComment(), validate, storeComment as BaseHandler);

export default router;