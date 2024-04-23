import { body } from "express-validator";

function validatePhotoStore()
{
    return [
        body('title')
            .not().equals('undefined')
            .withMessage('O título é obrigatório')
            .isString()
            .withMessage('O título é obrigatório')
            .isLength({ min: 3 })
            .withMessage('O título deve ter no mínimo 3 caracteres'),

        body('image')
            .custom((value, {req}) => {
                if(!req.file) {
                    throw new Error('A imagem é obrigatória');
                }

                return true;
            })
    ];
}

function validatePhotoUpdate()
{
    return [
        body('title')
            .optional()
            .isString()
            .withMessage('O título é obrigatório')
            .isLength({ min: 3 })
            .withMessage('O título deve ter no mínimo 3 caracteres')
    ];
}

function validatePhotoComment()
{
    return [
        body('comment')
            .isString()
            .withMessage('O comentário é obrigatório')
    ];

}

export { validatePhotoStore, validatePhotoUpdate, validatePhotoComment };