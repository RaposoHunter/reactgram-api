import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { Response as HttpResponse } from "../lib/Response.js";

async function authenticate(req: Request & { user?: Object }, res: Response, next: NextFunction) {
    const header = req.header('Authorization');

    if(!header) return res.status(HttpResponse.HTTP_UNAUTHORIZED).json({ errors: ['Acesso negado'] });

    const [type, token] = header.split(' ') as ["Basic" | "Bearer", string | undefined];

    if(!token) return res.status(HttpResponse.HTTP_UNAUTHORIZED).json({ errors: ['Acesso negado'] });

    try {
        const decoded = jwt.verify(token, process.env.APP_KEY!);
        const user = await User.findById(decoded instanceof Object ? decoded.id : decoded).select('-password');

        if(!user) return res.status(HttpResponse.HTTP_UNAUTHORIZED).json({ errors: ['Token inválido'] });

        req.user = user;

        next();
    } catch (error) {
        return res.status(HttpResponse.HTTP_UNAUTHORIZED).json({ errors: ['Token inválido'] });
    }
}

export default authenticate;