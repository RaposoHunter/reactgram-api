import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import router from './routes/Router.js';
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL!
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), '/uploads')));

await import('./config/db.js');

app.use(router);

app.listen(process.env.APP_PORT!, () => {
    console.log(`Server is running on port ${process.env.APP_PORT!}`);
});
