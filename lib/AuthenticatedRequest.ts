import { Request as BaseRequest } from "express";
import { Types } from "mongoose";

export declare interface AuthenticatedRequest extends BaseRequest {
    user: Object & { _id: Types.ObjectId, name: string, profileImage?: string, }
}