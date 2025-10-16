import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// A string de conexão agora é lida de um arquivo .env para segurança
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  // Adicionar configurações de SSL que são geralmente necessárias para o NeonDB
  ssl: {
    rejectUnauthorized: false,
  },
});

// O pool gerencia as conexões automaticamente. 
// O ideal é testar a conexão em uma rota de "health check", 
// mas para simplicidade, vamos deixar o pool lidar com isso.
// O .connect() inicial foi removido.

pool.on('connect', () => {
  console.log('Cliente conectado ao pool do NeonDB!');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no cliente do pool', err);
  process.exit(-1);
});
