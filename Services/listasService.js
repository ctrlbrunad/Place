import { pool } from "../db.js";

export const listasService = {
    async criarLista({ nome, usuarioId, estabelecimentos, publica }) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const queryLista = `
              INSERT INTO listas (nome, usuario_id, publica)
              VALUES ($1, $2, $3) RETURNING id
            `;
            const res = await client.query(queryLista, [nome, usuarioId, publica]);
            const listaId = res.rows[0].id;

            if (estabelecimentos && estabelecimentos.length > 0) {
                const queryEstab = `
                  INSERT INTO lista_estabelecimentos (lista_id, estabelecimento_id)
                  SELECT $1, unnest($2::text[])
                `;
                await client.query(queryEstab, [listaId, estabelecimentos]);
            }

            await client.query('COMMIT');
            return { id: listaId, nome, usuario_id: usuarioId, publica, estabelecimentos };

        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Erro na transação de criar lista:", error);
            throw new Error("Não foi possível criar a lista.");
        } finally {
            client.release();
        }
    },

    async listarListas(usuarioId) {
        const query = `
            SELECT l.id, l.nome, l.publica, array_agg(le.estabelecimento_id) as estabelecimentos
            FROM listas l
            LEFT JOIN lista_estabelecimentos le ON l.id = le.lista_id
            WHERE l.usuario_id = $1 OR l.publica = true
            GROUP BY l.id
            ORDER BY l.nome;
        `;
        const res = await pool.query(query, [usuarioId]);
        return res.rows;
    },

    async adicionarEstabelecimento(listaId, estabelecimentoId, usuarioId) {
        const listaRes = await pool.query('SELECT usuario_id FROM listas WHERE id = $1', [listaId]);
        if (listaRes.rowCount === 0) {
            throw new Error('Lista não encontrada.');
        }
        if (listaRes.rows[0].usuario_id !== usuarioId) {
            throw new Error('Usuário não autorizado a adicionar a esta lista.');
        }

        await pool.query('INSERT INTO lista_estabelecimentos (lista_id, estabelecimento_id) VALUES ($1, $2)', [listaId, estabelecimentoId]);
    },

    async removerEstabelecimento(listaId, estabelecimentoId, usuarioId) {
        const listaRes = await pool.query('SELECT usuario_id FROM listas WHERE id = $1', [listaId]);
        if (listaRes.rowCount === 0) {
            throw new Error('Lista não encontrada.');
        }
        if (listaRes.rows[0].usuario_id !== usuarioId) {
            throw new Error('Usuário não autorizado a remover desta lista.');
        }

        const result = await pool.query('DELETE FROM lista_estabelecimentos WHERE lista_id = $1 AND estabelecimento_id = $2', [listaId, estabelecimentoId]);

        if (result.rowCount === 0) {
            throw new Error('Estabelecimento não encontrado na lista.');
        }
    },

    async deletarLista(listaId, usuarioId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const listaRes = await client.query('SELECT usuario_id FROM listas WHERE id = $1', [listaId]);

            if (listaRes.rowCount === 0) {
                throw new Error('Lista não encontrada.');
            }

            if (listaRes.rows[0].usuario_id !== usuarioId) {
                throw new Error('Usuário não autorizado a deletar esta lista.');
            }

            await client.query('DELETE FROM lista_estabelecimentos WHERE lista_id = $1', [listaId]);
            await client.query('DELETE FROM listas WHERE id = $1', [listaId]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Erro na transação de deletar lista:", error);
            throw error;
        } finally {
            client.release();
        }
    }
};