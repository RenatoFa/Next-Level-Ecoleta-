import multer from 'multer';
import path from 'path'

// Upload de Imagens

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname,'..','..','uploads'),
        filename: (request,file,callback)=>{

        }
    }),
}