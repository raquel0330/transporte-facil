// =========================================
// BACKEND - TRANSPORTE FÁCIL
// =========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const nodemailer = require("nodemailer");

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
    }

});


// =========================================
// CONFIGURAÇÃO DO E-MAIL
// =========================================

const transporter =
    nodemailer.createTransport({

        service: "gmail",

        auth: {

            user:
                process.env.EMAIL_REMETENTE,

            pass:
                process.env.EMAIL_SENHA_APP

        }

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

    // Se não houver horário,
    // simplesmente salva uma lista vazia.

    if (!horarios) {

        return [];

    }


    // =====================================
    // FORMATO:
    //
    // [
    //     {
    //         saida: "06:00",
    //         chegada: "07:30"
    //     }
    // ]
    // =====================================

    if (Array.isArray(horarios)) {

        return horarios.filter(
            function (horario) {

                if (!horario) {
                    return false;
                }

                const saida =
                    texto(horario.saida);

                const chegada =
                    texto(horario.chegada);

                // Só salva horários completos.

                return (
                    saida !== "" &&
                    chegada !== ""
                );

            }
        );

    }


    // =====================================
    // CASO ANTIGO
    // =====================================

    if (
        typeof horarios === "object"
    ) {

        return horarios;

    }


    return [];

}


// =========================================
// VALIDAR DADOS DA ROTA
// =========================================

function validarDadosRota(dados) {

    const erros = [];


    const empresa =
        texto(
            dados.empresa
        );


    const emailResponsavel =
        texto(
            dados.emailResponsavel
        );


    const origem =
        texto(
            dados.origem
        );


    const destino =
        texto(
            dados.destino
        );


    const tipo =
        texto(
            dados.tipo
        );


    const dias =
        dados.dias;


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
    // IMPORTANTE
    // =====================================
    //
    // HORÁRIOS NÃO SÃO MAIS OBRIGATÓRIOS.
    //
    // =====================================


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
                validarDadosRota(
                    dados
                );


            if (
                erros.length > 0
            ) {

                console.log(
                    "Campos com problema:",
                    erros
                );


                return res.status(400).json({

                    mensagem:
                        "Não foi possível cadastrar a rota.",

                    camposPendentes:
                        erros,

                    detalhes:
                        "Verifique os campos obrigatórios."

                });

            }


            // =================================
            // CAMPOS
            // =================================

            const empresa =
                texto(
                    dados.empresa
                );


            const emailResponsavel =
                texto(
                    dados.emailResponsavel
                )
                .toLowerCase();


            const origem =
                texto(
                    dados.origem
                );


            const destino =
                texto(
                    dados.destino
                );


            const via =
                texto(
                    dados.via
                );


            const tipo =
                texto(
                    dados.tipo
                );


            const informacoes =
                texto(
                    dados.informacoes
                );


            const dias =
                dados.dias;


            // =================================
            // HORÁRIOS
            // =================================

            const horarios =
                normalizarHorarios(
                    dados.horarios
                );


            // =================================
            // CÓDIGO DE ACESSO
            // =================================

            const codigoAcesso =
                gerarCodigoAcesso();


            // =================================
            // SALVAR NO BANCO
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


            console.log(
                "================================="
            );

            console.log(
                "ROTA SALVA NO POSTGRESQL:"
            );

            console.log(
                resultado.rows[0]
            );

            console.log(
                "================================="
            );


            // =================================
            // ENVIAR E-MAIL
            // =================================

            try {

                await transporter.sendMail({

                    from:
                        `"Transporte Fácil" <${process.env.EMAIL_REMETENTE}>`,

                    to:
                        emailResponsavel,

                    subject:
                        "Código de acesso da sua rota - Transporte Fácil",

                    text:
                        `Olá!

A rota foi cadastrada com sucesso no Transporte Fácil.

Empresa/Agência: ${empresa}
Origem: ${origem}
Destino: ${destino}
Via: ${via || "Não informada"}

Seu código de acesso é:

${codigoAcesso}

Guarde este código para acessar e gerenciar sua rota posteriormente.

Atenciosamente,
Equipe Transporte Fácil`

                });


                console.log(
                    "E-mail enviado para:",
                    emailResponsavel
                );

            }

            catch (erroEmail) {

                console.error(
                    "Erro ao enviar e-mail:",
                    erroEmail
                );

            }


            // =================================
            // SUCESSO
            // =================================

            return res.status(201).json({

                mensagem:
                    "Rota cadastrada com sucesso!",

                rota:
                    resultado.rows[0]

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

app.put(
    "/rotas/:id",
    async function (req, res) {

        try {

            const id =
                req.params.id;


            const dados =
                req.body || {};


            console.log(
                "Dados recebidos para edição:",
                JSON.stringify(
                    dados,
                    null,
                    2
                )
            );


            const erros =
                validarDadosRota(
                    dados
                );


            if (
                erros.length > 0
            ) {

                return res.status(400).json({

                    mensagem:
                        "Não foi possível atualizar a rota.",

                    camposPendentes:
                        erros

                });

            }


            const empresa =
                texto(
                    dados.empresa
                );


            const emailResponsavel =
                texto(
                    dados.emailResponsavel
                )
                .toLowerCase();


            const origem =
                texto(
                    dados.origem
                );


            const destino =
                texto(
                    dados.destino
                );


            const via =
                texto(
                    dados.via
                );


            const tipo =
                texto(
                    dados.tipo
                );


            const dias =
                dados.dias;


            const horarios =
                normalizarHorarios(
                    dados.horarios
                );


            const informacoes =
                texto(
                    dados.informacoes
                );


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
                )
                .toLowerCase();


            const codigo =
                texto(
                    req.body.codigo
                )
                .toUpperCase();


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