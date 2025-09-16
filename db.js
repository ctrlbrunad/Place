
import pkg from 'pg';
const { Pool } = pkg;

const connectionString ='postgresql://neondb_owner:npg_gkUFNZVB43GK@ep-super-cherry-acmnzvw8-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

export const pool = new Pool({
  connectionString,
});


pool.connect()
  .then(() => console.log('Conectado ao NeonDB com sucesso!'))
  .catch(err => console.error('Erro ao conectar no NeonDB:', err));

  


  