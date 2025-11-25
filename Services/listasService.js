// /Services/listasService.js (COM FAVORITOS)
import { pool } from "../db.js";

export const listasService = {

    // Minhas Listas (Igual)
    async listarListas(usuarioId) {
        const query = `
            SELECT l.id, l.nome, l.descricao, l.publica, 
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

    // Listas Públicas (ATUALIZADO: Ordenação por Favorito)
    async listarListasPublicas(usuarioId) { 
        const query = `
            SELECT 
                l.id, l.nome, l.descricao, l.publica, u.nome as usuario_nome, 
                COUNT(DISTINCT le.estabelecimento_id) as total_estabelecimentos,
                -- Verifica se o usuário logado favoritou esta lista
                (CASE WHEN lf.lista_id IS NOT NULL THEN true ELSE false END) as favoritada
            FROM listas l
            JOIN users u ON l.usuario_id = u.id
            LEFT JOIN lista_estabelecimentos le ON l.id = le.lista_id
            -- Junta com a tabela de favoritos filtrando pelo usuário atual
            LEFT JOIN lista_favoritos lf ON l.id = lf.lista_id AND lf.usuario_id = $1
            WHERE l.publica = true AND l.usuario_id != $1
            GROUP BY l.id, u.nome, lf.lista_id
            -- ORDENAÇÃO: Favoritadas aparecem primeiro!
            ORDER BY favoritada DESC, COUNT(le.estabelecimento_id) DESC, l.nome;
        `;
        const res = await pool.query(query, [usuarioId]); 
        return res.rows;
    },
    
    // Detalhes (ATUALIZADO: Retorna se é favorito)
    async getDetalhesDaLista(listaId, usuarioId) {
        const listaQuery = `
            SELECT 
                l.*, 
                u.nome as usuario_nome,
                (SELECT COUNT(*) FROM lista_favoritos lf WHERE lf.lista_id = l.id AND lf.usuario_id = $2) > 0 as favoritada
            FROM listas l
            JOIN users u ON l.usuario_id = u.id
            WHERE l.id = $1
        `;
        const listaRes = await pool.query(listaQuery, [listaId, usuarioId]);
        
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

    // --- NOVA FUNÇÃO: Favoritar/Desfavoritar ---
    async toggleFavoritoLista(listaId, usuarioId) {
        const client = await pool.connect();
        try {
            // 1. Verifica se a lista existe e é pública (ou se o usuário é dono, embora raro favoritar a própria)
            const checkQuery = "SELECT publica, usuario_id FROM listas WHERE id = $1";
            const checkRes = await client.query(checkQuery, [listaId]);
            if (checkRes.rowCount === 0) throw new Error("Lista não encontrada.");
            
            // 2. Tenta deletar (se já favoritou)
            const deleteRes = await client.query(
                "DELETE FROM lista_favoritos WHERE lista_id = $1 AND usuario_id = $2",
                [listaId, usuarioId]
            );

            // 3. Se não deletou nada, insere
            if (deleteRes.rowCount === 0) {
                await client.query(
                    "INSERT INTO lista_favoritos (lista_id, usuario_id) VALUES ($1, $2)",
                    [listaId, usuarioId]
                );
                return { favoritada: true };
            }

            return { favoritada: false };

        } catch (error) {
            throw new Error(error.message);
        } finally {
            client.release();
        }
    },

    // --- FUNÇÕES DE CRIAÇÃO/EDIÇÃO (IGUAIS) ---
    async criarLista({ usuarioId, nome, descricao, publica, estabelecimentos = [] }) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const listaQuery = `INSERT INTO listas (nome, descricao, publica, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *`;
            const listaResult = await client.query(listaQuery, [nome, descricao, publica, usuarioId]);
            const listaId = listaResult.rows[0].id; 

            if (estabelecimentos && estabelecimentos.length > 0) {
                const estabValues = estabelecimentos.map((estId) => `(${listaId}, '${estId}')`).join(',');
                await client.query(`INSERT INTO lista_estabelecimentos (lista_id, estabelecimento_id) VALUES ${estabValues}`);
            }
            await client.query('COMMIT');
            return { ...listaResult.rows[0], estabelecimentos };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async adicionarEstabelecimento(listaId, estabelecimentoId, usuarioId) {
        const client = await pool.connect();
        try {
            const checkRes = await client.query("SELECT usuario_id FROM listas WHERE id = $1", [listaId]);
            if (checkRes.rowCount === 0 || checkRes.rows[0].usuario_id !== usuarioId) throw new Error("Não autorizado.");
            await client.query("INSERT INTO lista_estabelecimentos (lista_id, estabelecimento_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [listaId, estabelecimentoId]);
        } finally { client.release(); }
    },

    async removerEstabelecimento(listaId, estabelecimentoId, usuarioId) {
        const client = await pool.connect();
        try {
            const checkRes = await client.query("SELECT usuario_id FROM listas WHERE id = $1", [listaId]);
            if (checkRes.rowCount === 0 || checkRes.rows[0].usuario_id !== usuarioId) throw new Error("Não autorizado.");
            await client.query("DELETE FROM lista_estabelecimentos WHERE lista_id = $1 AND estabelecimento_id = $2", [listaId, estabelecimentoId]);
        } finally { client.release(); }
    },

    async deletarLista(listaId, usuarioId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const checkRes = await client.query("SELECT usuario_id FROM listas WHERE id = $1", [listaId]);
            if (checkRes.rowCount === 0 || checkRes.rows[0].usuario_id !== usuarioId) throw new Error("Não autorizado.");
            await client.query("DELETE FROM lista_favoritos WHERE lista_id = $1", [listaId]); // Limpa favoritos antes
            await client.query("DELETE FROM lista_estabelecimentos WHERE lista_id = $1", [listaId]);
            await client.query("DELETE FROM listas WHERE id = $1", [listaId]);
            await client.query('COMMIT');
        } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
    }
};