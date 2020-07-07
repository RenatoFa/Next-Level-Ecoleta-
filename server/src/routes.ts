// Rotas para o acesso 

import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer'
import {celebrate, Joi} from 'celebrate';



import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';


const routes = express.Router();
const upload = multer(multerConfig);




const pointsController = new PointsController();
const itemsController = new ItemsController();


// index , show , create ,update e delete

//Rotas do items no seeds do banco de dados

routes.get('/items', itemsController.index)

//Abrindo uma rota para passaggem dos parametros abaixo

routes.post('/points', upload.single('image'),pointsController.create)

// Buscar um item 

routes.get('/points/:id', pointsController.show);

// Listar varios pontos (estado / cidade/ items)

routes.get('/points',pointsController.index);
    
 
export default routes;

// Service Pattern
// repository Pattern