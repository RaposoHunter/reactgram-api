import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Response as HttpResponse } from "../lib/Response.js";
import { Types } from "mongoose";

function generateToken(id: Types.ObjectId)
{    
    const JWT_SECRET = process.env.APP_KEY;

    return jwt.sign({ id }, JWT_SECRET!, {
        expiresIn: '7d'
    });
}

async function register(req: Request, res: Response) {
    const {name, email, password} = req.body;

    if(await User.findOne({ email })) return res.status(HttpResponse.HTTP_UNPROCESSABLE_ENTITY).json({ errors: ['E-mail em uso'] });

    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: password_hash
    });

    if(!user) return res.status(HttpResponse.HTTP_INTERNAL_SERVER_ERROR).json({ errors: ['Algo deu errado ao criar o usuário. Tente novamente mais tarde!'] });

    return res.status(HttpResponse.HTTP_CREATED).json({
        _id: user._id,
        token: generateToken(user._id)
    });
}

export {
    register,
    generateToken
}