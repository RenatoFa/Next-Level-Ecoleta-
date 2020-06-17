//Serve Local

import express  from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes)
// Rota: Endereço completo da requisição 
// Rrecurso: Qual entidade estamos acessando do sistema

// Get: Buscar uma ou mais informações do back-end
// Post: Criar uma nova informação back-end
// Put: Atualizar uma informação existente no back-end
// Delete: Remover uma informação do back-end

// Post : http://localhost:3333/users = Criar um usuário 
// Get : http://localhost:3333/users = Listar usuários
// Get :  http://localhost:3333/users/5 = Buscar dados do usuário com ID 5

// Request Param : Parãmetros que vem na própia rota que identificam um recurso
// Query Param: Parâmetros que vem na própria rota geralmente opcionais para filtros e paginação 
// Request Body: Parãmetros para criação/atualização de informações

// SELECT * FROM users WHERE name = 'Diego'
// knex('users').where'name','Diego').select('*')

app.use('/uploads',express.static(path.resolve(__dirname,'..','uploads')));

app.listen(3333);