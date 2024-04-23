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

async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user) return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['E-mail e/ou senha inválidos'] });
    if(!(await bcrypt.compare(password, user.password as string))) return res.status(HttpResponse.HTTP_UNAUTHORIZED).json({ errors: ['E-mail e/ou senha inválidos'] });

    return res.status(HttpResponse.HTTP_OK).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id)
    });
}

async function profile(req: Request & { user: Object }, res: Response) {
    const user = req.user;

    return res.status(HttpResponse.HTTP_OK).json(user);
}

async function update(req: Request & { user?: Object & { _id: Types.ObjectId }}, res: Response) {
    const { name, password, bio } = req.body;
    let profile = null;
    let user = null;
    
    if(req.file) profile = req.file.filename;

    if(req.user) {
        user = await User.findById(new Types.ObjectId(req.user._id)).select('-password');
    }

    if(!user) return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Usuário não encontrado'] });

    if(name) user.name = name;
    if(password) {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, salt);
    };

    if(profile) user.profileImage = profile;
    if(bio) user.bio = bio;

    await user.save();

    return res.status(HttpResponse.HTTP_OK).json(user);
}

async function find(req: Request, res: Response)
{
    const { id } = req.params;
    let objId = null;

    try {
        objId = new Types.ObjectId(id);
    } catch (error) {
        const e = error as Error;
        
        return res.status(HttpResponse.HTTP_NOT_FOUND).json({
            errors: ['Usuário não encontrado']
        });
    }

    try {
        const user = await User.findById(new Types.ObjectId(req.params.id)).select('-password');
    
        if(!user) return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Usuário não encontrado'] });
    
        return res.status(HttpResponse.HTTP_OK).json(user);
    } catch (error) {
        const e = error as Error;
        
        return res.status(HttpResponse.HTTP_INTERNAL_SERVER_ERROR).json({
            errors: ['Algo deu errado ao buscar o usuário. Tente novamente mais tarde!']
        });
    }
}

export {
    register,
    login,
    profile,
    update,
    find
}