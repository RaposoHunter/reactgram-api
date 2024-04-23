import { body } from "express-validator";

function userCreateValidation()
{
    return [
        body('name')
            .isString()
            .withMessage('O nome é obrigatório')
            .isLength({ min: 3 })
            .withMessage('O nome deve ter no mínimo 3 caracteres'),
        body('email')
            .isString()
            .withMessage('O email é obrigatório')
            .isEmail()
            .withMessage('E-mail inválido'),
        body('password')
            .isString()
            .withMessage('A senha é obrigatória')
            .isLength({ min: 5 })
            .withMessage('A senha deve ter no mínimo 5 caracteres'),
        body('password_confirmation')
            .isString()
            .withMessage('A confirmação de senha é obrigatória')
            .custom((value, { req }) => {
                if(value !== req.body.password) {
                    throw new Error('As senhas não são iguais');
                }

                return true;
            })
    ];
}

function loginValidation()
{
    return [
        body('email')
            .isString()
            .withMessage('O email é obrigatório')
            .isEmail()
            .withMessage('E-mail inválido'),
        body('password')
            .isString()
            .withMessage('A senha é obrigatória')
    ]
}

function userUpdateValidation()
{
    return [
        body('name')
            .optional()
            .isLength({ min: 3 })
            .withMessage('O nome deve ter no mínimo 3 caracteres'),
    
        body('password')
            .optional()
            .isLength({ min: 5 })
            .withMessage('A senha deve ter no mínimo 5 caracteres')
    ];
}

export {
    userCreateValidation,
    loginValidation,
    userUpdateValidation
}