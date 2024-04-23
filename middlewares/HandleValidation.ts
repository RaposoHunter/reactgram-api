import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { Response as HttpResponse } from "../lib/Response";

function validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if(errors.isEmpty()) {
        return next();
    }

    const extractedErrors = errors.array().map(err => err.msg);

    return res.status(HttpResponse.HTTP_UNPROCESSABLE_ENTITY).json({
        errors: extractedErrors
    });
}

export default validate;