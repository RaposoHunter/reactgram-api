import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = '';

        if(req.baseUrl.includes('users')) {
            folder = 'users';
        } else if(req.baseUrl.includes('photos')) {
            folder = 'photos';
        }

        cb(null, `uploads/${folder}`);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg|webp)$/)) {
            return cb(new Error('Extensão inválida'));
        }

        cb(null, true);
    }
});

export default upload;