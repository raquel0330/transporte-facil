require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    }
});

async function verificar() {

    try {

        const resultado = await pool.query(`
            SELECT
                id,
                nome,
                origem,
                destino,
                horarios
            FROM rotas
            ORDER BY id DESC
            LIMIT 5
        `);

        console.log("\n=================================");
        console.log("ÚLTIMAS ROTAS CADASTRADAS");
        console.log("=================================\n");

        resultado.rows.forEach(function (rota) {

            console.log("ID:", rota.id);
            console.log("Empresa:", rota.nome);
            console.log("Origem:", rota.origem);
            console.log("Destino:", rota.destino);

            console.log(
                "Horários:",
                JSON.stringify(
                    rota.horarios,
                    null,
                    2
                )
            );

            console.log("---------------------------------\n");

        });

    }

    catch (erro) {

        console.error(
            "\nERRO AO CONSULTAR O POSTGRESQL:"
        );

        console.error(erro);

    }

    finally {

        await pool.end();

    }

}

verificar();