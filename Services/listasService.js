import { pool } from "../db.js";

export const listasService = {

    async listarListas(usuarioId) {
        const query = `
            SELECT l.id, l.nome, l.publica, 
                   COALESCE(array_agg(le.estabelecimento_id) FILTER (WHERE le.estabelecimento_id IS NOT NULL), '{}') as estabelecimentos
            FROM listas l
            LEFT JOIN lista_estabelecimentos le ON l.id = le.lista_id
            WHERE l.usuario_id = $1
            GROUP BY l.id
            ORDER BY l.nome;
        `;
        const res = await pool.query(query, [usuarioId]);
        return res.rows;
    },

    async listarListasPublicas(usuarioId) { 
        const query = `
            SELECT l.id, l.nome, l.publica, u.nome as usuario_nome, 
                   COUNT(le.estabelecimento_id) as total_estabelecimentos
            FROM listas l
            JOIN users u ON l.usuario_id = u.id
            LEFT JOIN lista_estabelecimentos le ON l.id = le.lista_id
            WHERE l.publica = true AND l.usuario_id != $1 -- 2. Filtra o usuário logado
            GROUP BY l.id, u.nome
            ORDER BY COUNT(le.estabelecimento_id) DESC, l.nome;
        `;
        const res = await pool.query(query, [usuarioId]); 
        return res.rows;
    },
    
    async getDetalhesDaLista(listaId, usuarioId) {
        const listaQuery = `
            SELECT l.*, u.nome as usuario_nome 
            FROM listas l
            JOIN users u ON l.usuario_id = u.id
            WHERE l.id = $1
        `;
        const listaRes = await pool.query(listaQuery, [listaId]);
        
        if (listaRes.rowCount === 0) {
            throw new Error('Lista não encontrada.');
        }
        
        const lista = listaRes.rows[0];

        if (!lista.publica && lista.usuario_id !== usuarioId) {
            throw new Error('Não autorizado.');
        }
        
        const estabQuery = `
            SELECT e.* FROM estabelecimentos e
            JOIN lista_estabelecimentos le ON e.id = le.estabelecimento_id
            WHERE le.lista_id = $1
        `;
        const estabRes = await pool.query(estabQuery, [listaId]);
        
        return { ...lista, estabelecimentos: estabRes.rows };
    },

    async criarLista({ usuarioId, nome, publica, estabelecimentos = [] }) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const listaQuery = `
                INSERT INTO listas (nome, publica, usuario_id)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const listaValues = [nome, publica, usuarioId];
            const listaResult = await client.query(listaQuery, listaValues);
            const novaLista = listaResult.rows[0];
            const listaId = novaLista.id; 

            if (estabelecimentos && estabelecimentos.length > 0) {
                const estabValues = estabelecimentos.map(
                    (estId) => `(${listaId}, '${estId}')`
                ).join(',');

                const estabQuery = `
                    INSERT INTO lista_estabelecimentos (lista_id, estabelecimento_id)
                    VALUES ${estabValues}
                `;
                await client.query(estabQuery);
            }

            await client.query('COMMIT');
            return { ...novaLista, estabelecimentos: estabelecimentos };

        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Erro ao criar lista:", error);
            throw new Error("Erro ao criar a lista no banco de dados.");
        } finally {
            client.release();
        }
    },

    async adicionarEstabelecimento(listaId, estabelecimentoId, usuarioId) {
        const client = await pool.connect();
        try {
            const checkQuery = "SELECT usuario_id FROM listas WHERE id = $1";
            const checkRes = await client.query(checkQuery, [listaId]);
            if (checkRes.rowCount === 0 || checkRes.rows[0].usuario_id !== usuarioId) {
                throw new Error("Não autorizado ou lista não encontrada.");
            }
            
            const query = `
                INSERT INTO lista_estabelecimentos (lista_id, estabelecimento_id)
                VALUES ($1, $2)
                ON CONFLICT (lista_id, estabelecimento_id) DO NOTHING
            `;
            await client.query(query, [listaId, estabelecimentoId]);
        } catch (error) {
            throw new Error(error.message);
        } finally {
            client.release();
        }
    },

    async removerEstabelecimento(listaId, estabelecimentoId, usuarioId) {
        const client = await pool.connect();
        try {
            const checkQuery = "SELECT usuario_id FROM listas WHERE id = $1";
            const checkRes = await client.query(checkQuery, [listaId]);
            if (checkRes.rowCount === 0 || checkRes.rows[0].usuario_id !== usuarioId) {
                throw new Error("Não autorizado ou lista não encontrada.");
            }

            const query = `
                DELETE FROM lista_estabelecimentos
                WHERE lista_id = $1 AND estabelecimento_id = $2
            `;
            await client.query(query, [listaId, estabelecimentoId]);
        } catch (error) {
            throw new Error(error.message);
        } finally {
            client.release();
        }
    },

    async deletarLista(listaId, usuarioId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const checkQuery = "SELECT usuario_id FROM listas WHERE id = $1";
            const checkRes = await client.query(checkQuery, [listaId]);
            if (checkRes.rowCount === 0) {
                throw new Error("Lista não encontrada.");
            }
            if (checkRes.rows[0].usuario_id !== usuarioId) {
                throw new Error("Não autorizado.");
            }
            
            await client.query("DELETE FROM lista_estabelecimentos WHERE lista_id = $1", [listaId]);
            await client.query("DELETE FROM listas WHERE id = $1", [listaId]);
            
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(error.message);
        } finally {
            client.release();
        }
    }
};