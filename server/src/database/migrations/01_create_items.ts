import Knex from 'knex';



export async function up(knex: Knex){
  //Criar a tabela

  // Tabela points

   return knex.schema.createTable('items',table =>{
       table.increments('id').primary();
       table.string('image').notNullable();
       table.string('title').notNullable();
       


 

   });
}

export async function down(knex:Knex){
   // Voltar atras (deletar a table)
   return knex.schema.dropTable('items');
}