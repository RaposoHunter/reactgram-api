import express, { Router } from "express";
import authRouter from './AuthRoutes.js';
import userRouter from './UserRoutes.js';
import photoRouter from './PhotoRoutes.js';

const router = express();

router.get('/', (req, res) => {
    res.json({
        [process.env.APP_NAME!]: 'API is running!'
    });
});

router.use('/api/', authRouter);
router.use('/api/users/', userRouter);
router.use('/api/photos/', photoRouter);

export default router;

export function newRouteGroup(prefix: string, router: Router, cb: (router: Router) => void)
{
    const newRouter = express.Router();
    cb(newRouter);
    router.use(prefix, newRouter);
}
