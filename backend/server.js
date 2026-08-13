// =========================================
// BACKEND - TRANSPORTE FÁCIL
// =========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();


// =========================================
// MIDDLEWARES
// =========================================

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
    },

    connectionTimeoutMillis: 10000,

    idleTimeoutMillis: 30000

});


// =========================================
// GERAR CÓDIGO DE ACESSO
// =========================================

function gerarCodigoAcesso() {

    const caracteres =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let codigo = "";

    for (let i = 0; i < 6; i++) {

        const indice =
            Math.floor(
                Math.random() *
                caracteres.length
            );

        codigo +=
            caracteres[indice];

    }

    return codigo;
}


// =========================================
// NORMALIZAR TEXTO
// =========================================

function texto(valor) {

    if (
        valor === undefined ||
        valor === null
    ) {

        return "";

    }

    return String(valor).trim();
}


// =========================================
// NORMALIZAR HORÁRIOS
// =========================================

function normalizarHorarios(horarios) {

    if (!Array.isArray(horarios)) {

        return [];

    }

    return horarios

        .filter(function (horario) {

            return (
                horario &&
                texto(horario.saida) &&
                texto(horario.chegada)
            );

        })

        .map(function (horario) {

            return {

                saida:
                    texto(horario.saida),

                chegada:
                    texto(horario.chegada)

            };

        });

}


// =========================================
// VALIDAR HORÁRIOS
// =========================================

function validarHorarios(horarios) {

    if (
        horarios === undefined ||
        horarios === null
    ) {

        return [];

    }

    if (!Array.isArray(horarios)) {

        return [
            "Formato dos horários inválido."
        ];

    }

    const erros = [];

    horarios.forEach(
        function (horario, indice) {

            if (!horario) {

                return;

            }

            const saida =
                texto(horario.saida);

            const chegada =
                texto(horario.chegada);

            if (
                saida &&
                !chegada
            ) {

                erros.push(
                    `Horário ${indice + 1}: informe a chegada.`
                );

            }

            if (
                !saida &&
                chegada
            ) {

                erros.push(
                    `Horário ${indice + 1}: informe a saída.`
                );

            }

        }
    );

    return erros;

}


// =========================================
// VALIDAR DADOS DA ROTA
// =========================================

function validarDadosRota(dados) {

    const erros = [];

    const empresa =
        texto(dados.empresa);

    const emailResponsavel =
        texto(dados.emailResponsavel);

    const origem =
        texto(dados.origem);

    const destino =
        texto(dados.destino);

    const tipo =
        texto(dados.tipo);

    const dias =
        dados.dias;

    const horarios =
        dados.horarios;


    // =====================================
    // EMPRESA
    // =====================================

    if (!empresa) {

        erros.push(
            "Empresa / Agência"
        );

    }


    // =====================================
    // E-MAIL
    // =====================================

    if (!emailResponsavel) {

        erros.push(
            "E-mail do responsável"
        );

    }


    if (emailResponsavel) {

        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailValido.test(
                emailResponsavel
            )
        ) {

            erros.push(
                "E-mail do responsável inválido"
            );

        }

    }


    // =====================================
    // ORIGEM
    // =====================================

    if (!origem) {

        erros.push(
            "Origem"
        );

    }


    // =====================================
    // DESTINO
    // =====================================

    if (!destino) {

        erros.push(
            "Destino"
        );

    }


    // =====================================
    // TIPO
    // =====================================

    if (!tipo) {

        erros.push(
            "Tipo de transporte"
        );

    }


    // =====================================
    // DIAS
    // =====================================

    if (
        !Array.isArray(dias) ||
        dias.length === 0
    ) {

        erros.push(
            "Dias de funcionamento"
        );

    }


    // =====================================
    // HORÁRIOS
    // =====================================

    erros.push(
        ...validarHorarios(horarios)
    );

    return erros;

}


// =========================================
// ROTA INICIAL
// =========================================

app.get(
    "/",
    async function (req, res) {

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

    }
);


// =========================================
// CADASTRAR ROTA
// =========================================

app.post(
    "/rotas",
    async function (req, res) {

        try {

            console.log(
                "================================="
            );

            console.log(
                "DADOS RECEBIDOS EM POST /rotas:"
            );

            console.log(
                JSON.stringify(
                    req.body,
                    null,
                    2
                )
            );

            console.log(
                "================================="
            );


            const dados =
                req.body || {};


            // =================================
            // VALIDAR
            // =================================

            const erros =
                validarDadosRota(dados);


            if (erros.length > 0) {

                console.log(
                    "Campos com problema:",
                    erros
                );

                return res.status(400).json({

                    mensagem:
                        "Não foi possível cadastrar a rota.",

                    camposPendentes:
                        erros

                });

            }


            // =================================
            // DADOS
            // =================================

            const empresa =
                texto(dados.empresa);


            const emailResponsavel =
                texto(
                    dados.emailResponsavel
                ).toLowerCase();


            const origem =
                texto(dados.origem);


            const destino =
                texto(dados.destino);


            const via =
                texto(dados.via);


            const tipo =
                texto(dados.tipo);


            const dias =
                dados.dias;


            const informacoes =
                texto(dados.informacoes);


            const horarios =
                normalizarHorarios(
                    dados.horarios
                );


            // =================================
            // GERAR CÓDIGO
            // =================================

            const codigoAcesso =
                gerarCodigoAcesso();


            // =================================
            // SALVAR NO POSTGRESQL
            // =================================

            const resultado =
                await pool.query(

                    `
                    INSERT INTO rotas
                    (
                        nome,
                        email_responsavel,
                        codigo_acesso,
                        origem,
                        destino,
                        via,
                        tipo,
                        dias,
                        horarios,
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
                        $8,
                        $9,
                        $10
                    )

                    RETURNING *
                    `,

                    [

                        empresa,

                        emailResponsavel,

                        codigoAcesso,

                        origem,

                        destino,

                        via || null,

                        tipo,

                        dias.join(","),

                        JSON.stringify(
                            horarios
                        ),

                        informacoes || null

                    ]

                );


            const rotaSalva =
                resultado.rows[0];


            console.log(
                "================================="
            );

            console.log(
                "ROTA SALVA COM SUCESSO!"
            );

            console.log(
                "ID:",
                rotaSalva.id
            );

            console.log(
                "EMPRESA:",
                rotaSalva.nome
            );

            console.log(
                "E-MAIL:",
                rotaSalva.email_responsavel
            );

            console.log(
                "CÓDIGO DE ACESSO:",
                rotaSalva.codigo_acesso
            );

            console.log(
                "================================="
            );


            // =================================
            // RESPONDER IMEDIATAMENTE
            // =================================

            return res.status(201).json({

                sucesso:
                    true,

                mensagem:
                    "Rota cadastrada com sucesso!",

                codigoAcesso:
                    rotaSalva.codigo_acesso,

                rota:
                    rotaSalva

            });

        }

        catch (erro) {

            console.error(
                "================================="
            );

            console.error(
                "ERRO AO CADASTRAR ROTA:"
            );

            console.error(
                erro
            );

            console.error(
                "================================="
            );


            return res.status(500).json({

                sucesso:
                    false,

                mensagem:
                    "Erro ao cadastrar rota.",

                erro:
                    erro.message

            });

        }

    }
);


// =========================================
// LISTAR ROTAS
// =========================================

app.get(
    "/rotas",
    async function (req, res) {

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

    }
);


// =========================================
// BUSCAR ROTA POR ID
// =========================================

app.get(
    "/rotas/:id",
    async function (req, res) {

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


            if (
                resultado.rows.length === 0
            ) {

                return res.status(404).json({

                    mensagem:
                        "Rota não encontrada."

                });

            }


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

    }
);


// =========================================
// EDITAR ROTA
// =========================================
//
// IMPORTANTE:
// O código de acesso NÃO é alterado.
// =========================================

app.put(
    "/rotas/:id",
    async function (req, res) {

        try {

            const id =
                req.params.id;

            const dados =
                req.body || {};


            console.log(
                "================================="
            );

            console.log(
                "DADOS RECEBIDOS EM PUT /rotas/:id:"
            );

            console.log(
                JSON.stringify(
                    dados,
                    null,
                    2
                )
            );

            console.log(
                "================================="
            );


            const erros =
                validarDadosRota(dados);


            if (erros.length > 0) {

                return res.status(400).json({

                    mensagem:
                        "Não foi possível atualizar a rota.",

                    camposPendentes:
                        erros

                });

            }


            const empresa =
                texto(dados.empresa);


            const emailResponsavel =
                texto(
                    dados.emailResponsavel
                ).toLowerCase();


            const origem =
                texto(dados.origem);


            const destino =
                texto(dados.destino);


            const via =
                texto(dados.via);


            const tipo =
                texto(dados.tipo);


            const dias =
                dados.dias;


            const horarios =
                normalizarHorarios(
                    dados.horarios
                );


            const informacoes =
                texto(dados.informacoes);


            const resultado =
                await pool.query(

                    `
                    UPDATE rotas

                    SET

                        nome = $1,

                        email_responsavel = $2,

                        origem = $3,

                        destino = $4,

                        via = $5,

                        tipo = $6,

                        dias = $7,

                        horarios = $8,

                        informacoes = $9

                    WHERE id = $10

                    RETURNING *
                    `,

                    [

                        empresa,

                        emailResponsavel,

                        origem,

                        destino,

                        via || null,

                        tipo,

                        dias.join(","),

                        JSON.stringify(
                            horarios
                        ),

                        informacoes || null,

                        id

                    ]

                );


            if (
                resultado.rows.length === 0
            ) {

                return res.status(404).json({

                    mensagem:
                        "Rota não encontrada."

                });

            }


            res.json({

                sucesso:
                    true,

                mensagem:
                    "Rota atualizada com sucesso!",

                codigoAcesso:
                    resultado.rows[0].codigo_acesso,

                rota:
                    resultado.rows[0]

            });

        }

        catch (erro) {

            console.error(
                "================================="
            );

            console.error(
                "ERRO AO EDITAR ROTA:"
            );

            console.error(
                erro
            );

            console.error(
                "================================="
            );

            res.status(500).json({

                mensagem:
                    "Erro ao editar rota.",

                erro:
                    erro.message

            });

        }

    }
);


// =========================================
// EXCLUIR ROTA
// =========================================

app.delete(
    "/rotas/:id",
    async function (req, res) {

        try {

            const id =
                req.params.id;


            const resultado =
                await pool.query(

                    `
                    DELETE FROM rotas
                    WHERE id = $1
                    RETURNING *
                    `,

                    [id]

                );


            if (
                resultado.rows.length === 0
            ) {

                return res.status(404).json({

                    mensagem:
                        "Rota não encontrada."

                });

            }


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

    }
);


// =========================================
// LOGIN DO RESPONSÁVEL
// =========================================

app.post(
    "/responsavel/login",
    async function (req, res) {

        try {

            const email =
                texto(
                    req.body.email
                ).toLowerCase();


            const codigo =
                texto(
                    req.body.codigo
                ).toUpperCase();


            if (
                !email ||
                !codigo
            ) {

                return res.status(400).json({

                    mensagem:
                        "Informe o e-mail e o código de acesso."

                });

            }


            const resultado =
                await pool.query(

                    `
                    SELECT *
                    FROM rotas
                    WHERE email_responsavel = $1
                    AND codigo_acesso = $2
                    `,

                    [

                        email,

                        codigo

                    ]

                );


            if (
                resultado.rows.length === 0
            ) {

                return res.status(401).json({

                    mensagem:
                        "E-mail ou código de acesso inválido."

                });

            }


            res.json({

                sucesso:
                    true,

                mensagem:
                    "Acesso autorizado!",

                rota:
                    resultado.rows[0]

            });

        }

        catch (erro) {

            console.error(
                "Erro no login do responsável:",
                erro
            );

            res.status(500).json({

                mensagem:
                    "Erro ao realizar o acesso.",

                erro:
                    erro.message

            });

        }

    }
);


// =========================================
// TESTAR CONEXÃO COM BANCO
// =========================================

app.get(
    "/teste-banco",
    async function (req, res) {

        try {

            const resultado =
                await pool.query(
                    "SELECT COUNT(*) AS total FROM rotas"
                );


            res.json({

                mensagem:
                    "Banco conectado corretamente.",

                totalRotas:
                    resultado.rows[0].total

            });

        }

        catch (erro) {

            console.error(
                "Erro no teste do banco:",
                erro
            );

            res.status(500).json({

                mensagem:
                    "Erro ao testar o banco.",

                erro:
                    erro.message

            });

        }

    }
);


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