import express, { Router } from "express";
import authRouter from './AuthRoutes.js';

const router = express();

router.get('/', (req, res) => {
    res.json({
        [process.env.APP_NAME!]: 'API is running!'
    });
});

router.use('/api/users/', authRouter);

export default router;

export function newRouteGroup(prefix: string, router: Router, cb: (router: Router) => void)
{
    const newRouter = express.Router();
    cb(newRouter);
    router.use(prefix, newRouter);
}
