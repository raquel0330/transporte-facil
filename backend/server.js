// =========================================
// BACKEND - TRANSPORTE FÁCIL
// =========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());


// =========================================
// CONEXÃO COM POSTGRESQL
// =========================================

const pool = new Pool({

    connectionString:
        process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    }

});


// =========================================
// TESTAR BACKEND E BANCO
// =========================================

app.get("/", async function (req, res) {

    try {

        const resultado =
            await pool.query(
                "SELECT NOW()"
            );


        res.json({

            mensagem:
                "Backend do Transporte Fácil funcionando!",

            banco:
                "PostgreSQL conectado!",

            horario:
                resultado.rows[0].now

        });

    }

    catch (erro) {

        console.error(
            "Erro ao conectar ao PostgreSQL:",
            erro
        );


        res.status(500).json({

            mensagem:
                "Backend funcionando, mas houve erro no PostgreSQL.",

            erro:
                erro.message

        });

    }

});


// =========================================
// CADASTRAR ROTA
// =========================================

app.post("/rotas", async function (req, res) {

    try {

        const {
            empresa,
            origem,
            destino,
            tipo,
            horarioSaida,
            horarioChegada,
            dias,
            informacoes
        } = req.body;


        // =================================
        // VALIDAÇÃO
        // =================================

        if (
            !empresa ||
            !origem ||
            !destino ||
            !tipo ||
            !horarioSaida ||
            !horarioChegada ||
            !dias ||
            dias.length === 0
        ) {

            return res.status(400).json({

                mensagem:
                    "Preencha todos os campos obrigatórios."

            });

        }


        // =================================
        // SALVAR NO BANCO
        // =================================

        const resultado =
            await pool.query(

                `
                INSERT INTO rotas
                (
                    nome,
                    origem,
                    destino,
                    tipo,
                    horario_saida,
                    horario_chegada,
                    dias,
                    informacoes
                )

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8
                )

                RETURNING *
                `,

                [
                    empresa,
                    origem,
                    destino,
                    tipo,
                    horarioSaida,
                    horarioChegada,
                    dias.join(","),
                    informacoes || null
                ]

            );


        // =================================
        // RESPOSTA
        // =================================

        res.status(201).json({

            mensagem:
                "Rota cadastrada com sucesso!",

            rota:
                resultado.rows[0]

        });

    }

    catch (erro) {

        console.error(
            "Erro ao cadastrar rota:",
            erro
        );


        res.status(500).json({

            mensagem:
                "Erro ao cadastrar rota.",

            erro:
                erro.message

        });

    }

});


// =========================================
// LISTAR TODAS AS ROTAS
// =========================================

app.get("/rotas", async function (req, res) {

    try {

        const resultado =
            await pool.query(

                `
                SELECT *
                FROM rotas
                ORDER BY id DESC
                `

            );


        res.json({

            rotas:
                resultado.rows

        });

    }

    catch (erro) {

        console.error(
            "Erro ao buscar rotas:",
            erro
        );


        res.status(500).json({

            mensagem:
                "Erro ao buscar rotas.",

            erro:
                erro.message

        });

    }

});


// =========================================
// BUSCAR UMA ROTA PELO ID
// =========================================

app.get("/rotas/:id", async function (req, res) {

    try {

        const id =
            req.params.id;


        const resultado =
            await pool.query(

                `
                SELECT *
                FROM rotas
                WHERE id = $1
                `,

                [id]

            );


        // =================================
        // ROTA NÃO ENCONTRADA
        // =================================

        if (resultado.rows.length === 0) {

            return res.status(404).json({

                mensagem:
                    "Rota não encontrada."

            });

        }


        // =================================
        // RESPOSTA
        // =================================

        res.json({

            rota:
                resultado.rows[0]

        });

    }

    catch (erro) {

        console.error(
            "Erro ao buscar rota:",
            erro
        );


        res.status(500).json({

            mensagem:
                "Erro ao buscar rota.",

            erro:
                erro.message

        });

    }

});


// =========================================
// EDITAR ROTA
// =========================================

app.put("/rotas/:id", async function (req, res) {

    try {

        const id =
            req.params.id;


        const {
            empresa,
            origem,
            destino,
            tipo,
            horarioSaida,
            horarioChegada,
            dias,
            informacoes
        } = req.body;


        // =================================
        // VALIDAÇÃO
        // =================================

        if (
            !empresa ||
            !origem ||
            !destino ||
            !tipo ||
            !horarioSaida ||
            !horarioChegada ||
            !dias ||
            dias.length === 0
        ) {

            return res.status(400).json({

                mensagem:
                    "Preencha todos os campos obrigatórios."

            });

        }


        // =================================
        // ATUALIZAR NO BANCO
        // =================================

        const resultado =
            await pool.query(

                `
                UPDATE rotas

                SET
                    nome = $1,
                    origem = $2,
                    destino = $3,
                    tipo = $4,
                    horario_saida = $5,
                    horario_chegada = $6,
                    dias = $7,
                    informacoes = $8

                WHERE id = $9

                RETURNING *
                `,

                [
                    empresa,
                    origem,
                    destino,
                    tipo,
                    horarioSaida,
                    horarioChegada,
                    dias.join(","),
                    informacoes || null,
                    id
                ]

            );


        // =================================
        // ROTA NÃO ENCONTRADA
        // =================================

        if (resultado.rows.length === 0) {

            return res.status(404).json({

                mensagem:
                    "Rota não encontrada."

            });

        }


        // =================================
        // RESPOSTA
        // =================================

        res.json({

            mensagem:
                "Rota atualizada com sucesso!",

            rota:
                resultado.rows[0]

        });

    }

    catch (erro) {

        console.error(
            "Erro ao editar rota:",
            erro
        );


        res.status(500).json({

            mensagem:
                "Erro ao editar rota.",

            erro:
                erro.message

        });

    }

});


// =========================================
// EXCLUIR ROTA
// =========================================

app.delete("/rotas/:id", async function (req, res) {

    try {

        const id =
            req.params.id;


        // =================================
        // EXCLUIR DO BANCO
        // =================================

        const resultado =
            await pool.query(

                `
                DELETE FROM rotas

                WHERE id = $1

                RETURNING *
                `,

                [id]

            );


        // =================================
        // ROTA NÃO ENCONTRADA
        // =================================

        if (resultado.rows.length === 0) {

            return res.status(404).json({

                mensagem:
                    "Rota não encontrada."

            });

        }


        // =================================
        // RESPOSTA
        // =================================

        res.json({

            mensagem:
                "Rota excluída com sucesso!",

            rota:
                resultado.rows[0]

        });

    }

    catch (erro) {

        console.error(
            "Erro ao excluir rota:",
            erro
        );


        res.status(500).json({

            mensagem:
                "Erro ao excluir rota.",

            erro:
                erro.message

        });

    }

});


// =========================================
// SERVIDOR
// =========================================

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    function () {

        console.log(
            `Servidor rodando na porta ${PORT}`
        );

    }
);