// /Services/listasService.js (VERSÃO COMPLETA E CORRIGIDA)
import { pool } from "../db.js";

export const listasService = {

    // --- FUNÇÕES QUE VOCÊ JÁ TINHA ---
    async listarListas(usuarioId) {
        //
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

    async listarListasPublicas() {
        //
        const query = `
            SELECT l.id, l.nome, l.publica, u.nome as usuario_nome, 
                   COUNT(le.estabelecimento_id) as total_estabelecimentos
            FROM listas l
            JOIN users u ON l.usuario_id = u.id
            LEFT JOIN lista_estabelecimentos le ON l.id = le.lista_id
            WHERE l.publica = true
            GROUP BY l.id, u.nome
            ORDER BY COUNT(le.estabelecimento_id) DESC, l.nome;
        `;
        const res = await pool.query(query);
        return res.rows;
    },
    
    async getDetalhesDaLista(listaId, usuarioId) {
        //
        // 1. Busca a lista e o nome do dono
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

        // 2. Verifica permissão
        if (!lista.publica && lista.usuario_id !== usuarioId) {
            throw new Error('Não autorizado.');
        }
        
        // 3. Busca os detalhes dos estabelecimentos
        const estabQuery = `
            SELECT e.* FROM estabelecimentos e
            JOIN lista_estabelecimentos le ON e.id = le.estabelecimento_id
            WHERE le.lista_id = $1
        `;
        const estabRes = await pool.query(estabQuery, [listaId]);
        
        return { ...lista, estabelecimentos: estabRes.rows };
    },

    // --- FUNÇÃO 'criarLista' CORRIGIDA (PARA ID SERIAL) ---
    async criarLista({ usuarioId, nome, publica, estabelecimentos = [] }) {
        // O 'id' é SERIAL, então não enviamos ele.
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Inserir a lista (sem 'id')
            const listaQuery = `
                INSERT INTO listas (nome, publica, usuario_id)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const listaValues = [nome, publica, usuarioId];
            const listaResult = await client.query(listaQuery, listaValues);
            const novaLista = listaResult.rows[0];
            const listaId = novaLista.id; // Pega o ID que o banco gerou

            // Adicionar estabelecimentos (se houver)
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

    // --- OUTRAS FUNÇÕES QUE ESTAVAM FALTANDO ---
    // (Chamadas pelo seu listasController.js)

    async adicionarEstabelecimento(listaId, estabelecimentoId, usuarioId) {
        const client = await pool.connect();
        try {
            // Verifica se o usuário é dono da lista
            const checkQuery = "SELECT usuario_id FROM listas WHERE id = $1";
            const checkRes = await client.query(checkQuery, [listaId]);
            if (checkRes.rowCount === 0 || checkRes.rows[0].usuario_id !== usuarioId) {
                throw new Error("Não autorizado ou lista não encontrada.");
            }
            
            // Insere o estabelecimento
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
            // Verifica se o usuário é dono da lista
            const checkQuery = "SELECT usuario_id FROM listas WHERE id = $1";
            const checkRes = await client.query(checkQuery, [listaId]);
            if (checkRes.rowCount === 0 || checkRes.rows[0].usuario_id !== usuarioId) {
                throw new Error("Não autorizado ou lista não encontrada.");
            }

            // Remove o estabelecimento
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
            
            // Verifica se o usuário é dono da lista
            const checkQuery = "SELECT usuario_id FROM listas WHERE id = $1";
            const checkRes = await client.query(checkQuery, [listaId]);
            if (checkRes.rowCount === 0) {
                throw new Error("Lista não encontrada.");
            }
            if (checkRes.rows[0].usuario_id !== usuarioId) {
                throw new Error("Não autorizado.");
            }
            
            // Deleta as associações (chave estrangeira)
            await client.query("DELETE FROM lista_estabelecimentos WHERE lista_id = $1", [listaId]);

            // Deleta a lista
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