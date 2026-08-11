require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function atualizarTabela() {

    try {

        await pool.query(`
            ALTER TABLE rotas
            ADD COLUMN IF NOT EXISTS responsavel_email VARCHAR(255),
            ADD COLUMN IF NOT EXISTS codigo_acesso VARCHAR(20)
        `);

        console.log(
            "Tabela rotas atualizada com sucesso!"
        );

    }

    catch (erro) {

        console.error(
            "Erro ao atualizar a tabela:",
            erro.message
        );

    }

    finally {

        await pool.end();

    }

}

atualizarTabela();