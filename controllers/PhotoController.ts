import mongoose, { Types } from "mongoose";
import { Photo } from "../models/Photo.js";
import { User } from "../models/User.js";
import { Request, Response } from "express";
import { Response as HttpResponse } from "../lib/Response.js";
import { AuthenticatedRequest } from "../lib/AuthenticatedRequest.js";

async function index(req: AuthenticatedRequest, res: Response)
{
    const photos = await Photo.find({}).sort([['createdAt', -1]]).exec();

    return res.status(HttpResponse.HTTP_OK).json(photos);
}

async function store(req: AuthenticatedRequest, res: Response) 
{
    const { title } = req.body;
    const image = req.file?.filename;        

    const user = await User.findById(new Types.ObjectId(req.user._id));
    if(!user) return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Usuário não encontrado'] });

    const photo = await Photo.create({
        title,
        image,
        userId: user._id,
        userName: user.name
    });

    if(!photo) return res.status(HttpResponse.HTTP_INTERNAL_SERVER_ERROR).json({ errors: ['Algo deu errado ao inserir a foto. Tente novamente mais tarde!'] });
    
    return res.status(HttpResponse.HTTP_CREATED).json(photo);
}

async function find(req: AuthenticatedRequest, res: Response)
{
    const { id } = req.params;

    let objId = null;

    try {
        objId = new Types.ObjectId(id);
    } catch (error) {
        const e = error as Error;
        
        return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Foto não encontrada'] });
    }

    const photo = await Photo.findById(objId);
    if(!photo) return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Foto não encontrada'] });

    return res.status(HttpResponse.HTTP_OK).json(photo);
}

async function update(req: AuthenticatedRequest, res: Response)
{
    const { id } = req.params;

    let objId = null;

    try {
        objId = new Types.ObjectId(id);
    } catch (error) {
        const e = error as Error;
        
        return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Foto não encontrada'] });
    }

    const user = req.user;

    const photo = await Photo.findById(objId);
    if(!photo) return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Foto não encontrada'] });

    if(!photo.userId!.equals(user._id)) return res.status(HttpResponse.HTTP_FORBIDDEN).json({ errors: ['Você não tem permissão para editar essa foto'] });

    if(req.body.title) {
        photo.title = req.body.title;    
    }

    await photo.save();

    return res.status(HttpResponse.HTTP_OK).json({
        photo,
        message: 'Foto atualizada com sucesso'
    });    
}

async function destroy(req: AuthenticatedRequest, res: Response) 
{
    const { id } = req.params;

    let objId = null;

    try {
        objId = new Types.ObjectId(id);
    } catch (error) {
        const e = error as Error;
        
        return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Foto não encontrada'] });
    }

    const user = req.user;

    const photo = await Photo.findById(objId);
    if(!photo) return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Foto não encontrada'] });

    if(!photo.userId!.equals(user._id)) {
        return res.status(HttpResponse.HTTP_FORBIDDEN).json({ errors: ['Você não tem permissão para deletar essa foto'] });
    }

    await Photo.findByIdAndDelete(photo._id);

    return res.status(HttpResponse.HTTP_OK).json({ 
        id: photo._id,
        message: 'Foto deletada com sucesso' 
    });
}

async function fromUser(req: AuthenticatedRequest, res: Response)
{
    const { id } = req.params;

    let objId = null;

    try {
        objId = new Types.ObjectId(id);
    } catch (error) {
        const e = error as Error;
        
        return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Usuário não encontrado'] });
    }

    const user = await User.findById(new Types.ObjectId(id));
    if(!user) return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Usuário não encontrado'] });    

    const photos = await Photo.find({ userId: user._id }).sort([['createdAt', -1]]).exec();

    return res.status(HttpResponse.HTTP_OK).json(photos);
}

async function like(req : AuthenticatedRequest, res: Response)
{
    const { id } = req.params;

    let objId = null;

    try {
        objId = new Types.ObjectId(id);
    } catch (error) {
        const e = error as Error;
        
        return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Foto não encontrada'] });
    }

    const user = req.user;

    const photo = await Photo.findById(objId);
    if(!photo) return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Foto não encontrada'] });

    if(photo.likes.includes(user._id)) return res.status(HttpResponse.HTTP_UNPROCESSABLE_ENTITY).json({ errors: ['Você já curtiu a foto'] });

    photo.likes.push(user._id);

    await photo.save();

    return res.status(HttpResponse.HTTP_OK).json({
        photoId: photo._id,
        userId: user._id,        
        message: 'Foto curtida com sucesso'
    });
}

async function storeComment(req: AuthenticatedRequest, res: Response)
{
    const { id } = req.params;

    let objId = null;

    try {
        objId = new Types.ObjectId(id);
    } catch (error) {
        const e = error as Error;
        
        return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Foto não encontrada'] });
    }

    const user = req.user;

    const photo = await Photo.findById(objId);
    if(!photo) return res.status(HttpResponse.HTTP_NOT_FOUND).json({ errors: ['Foto não encontrada'] });

    const { comment } = req.body;

    photo.comments.push({
        userId: user._id,
        userImage: user.profileImage,
        userName: user.name,
        comment
    });

    await photo.save();

    return res.status(HttpResponse.HTTP_OK).json({
        comment: photo.comments.at(-1),
        message: 'Comentário adicionado com sucesso'
    });
}

async function search(req: AuthenticatedRequest, res: Response)
{
    const { q } = req.query;

    const filter = !!q ? { title: new RegExp(q as string, 'i') } : {};

    const photos = await Photo.find(filter).sort([['createdAt', -1]]).exec();

    return res.status(HttpResponse.HTTP_OK).json(photos);
}

export {
    index,
    search,
    store,
    find,
    update,
    destroy,
    fromUser,
    like,
    storeComment,
}