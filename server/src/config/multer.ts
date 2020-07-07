import multer from 'multer';
import path from 'path';
import cryto from 'crypto'; // para um id diferente na imagens

// Upload de Imagens

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname,'..','..','uploads'),
        filename: (request,file,callback)=>{
        const hash = cryto.randomBytes(6).toString('hex');
        const fileName = `${hash}-${file.originalname}`;

        callback(null,fileName);
        }
    }),
}