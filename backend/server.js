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
// TESTE DE ERRO DO POOL
// =========================================

pool.on(
    "error",
    function (erro) {

        console.error(
            "================================="
        );

        console.error(
            "ERRO NO POOL DO POSTGRESQL:"
        );

        console.error(
            erro
        );

        console.error(
            "================================="
        );

    }
);


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

        const inicio =
            Date.now();

        console.log(
            "================================="
        );

        console.log(
            "TESTE / INICIADO"
        );

        console.log(
            "Horário:",
            new Date().toISOString()
        );

        try {

            console.log(
                "Consultando PostgreSQL..."
            );

            const resultado =
                await pool.query(
                    "SELECT NOW()"
                );

            console.log(
                "PostgreSQL respondeu em:",
                Date.now() - inicio,
                "ms"
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
                "================================="
            );

            console.error(
                "ERRO AO CONECTAR AO POSTGRESQL:"
            );

            console.error(
                erro
            );

            console.error(
                "Tempo até o erro:",
                Date.now() - inicio,
                "ms"
            );

            console.error(
                "================================="
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

        const inicioCadastro =
            Date.now();

        console.log(
            "================================="
        );

        console.log(
            "INÍCIO DO CADASTRO DA ROTA"
        );

        console.log(
            "Horário:",
            new Date().toISOString()
        );

        console.log(
            "================================="
        );


        try {

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
            // TESTE - RECEBIMENTO
            // =================================

            console.log(
                "[TESTE 1] Dados recebidos em:",
                Date.now() - inicioCadastro,
                "ms"
            );


            // =================================
            // VALIDAR
            // =================================

            const inicioValidacao =
                Date.now();

            const erros =
                validarDadosRota(dados);

            console.log(
                "[TESTE 2] Validação concluída em:",
                Date.now() - inicioValidacao,
                "ms"
            );


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


            console.log(
                "[TESTE 3] Dados preparados em:",
                Date.now() - inicioCadastro,
                "ms"
            );


            // =================================
            // GERAR CÓDIGO
            // =================================

            const inicioCodigo =
                Date.now();

            const codigoAcesso =
                gerarCodigoAcesso();

            console.log(
                "[TESTE 4] Código gerado:",
                codigoAcesso
            );

            console.log(
                "[TESTE 4] Geração do código levou:",
                Date.now() - inicioCodigo,
                "ms"
            );


            // =================================
            // TESTAR CONEXÃO ANTES DO INSERT
            // =================================

            console.log(
                "[TESTE 5] Preparando INSERT no PostgreSQL..."
            );

            console.log(
                "Tempo desde o início:",
                Date.now() - inicioCadastro,
                "ms"
            );


            const inicioInsert =
                Date.now();


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


            const tempoInsert =
                Date.now() - inicioInsert;


            console.log(
                "[TESTE 6] INSERT terminou."
            );

            console.log(
                "[TESTE 6] Tempo do INSERT:",
                tempoInsert,
                "ms"
            );

            console.log(
                "[TESTE 6] Tempo total até agora:",
                Date.now() - inicioCadastro,
                "ms"
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
                "VIA:",
                rotaSalva.via
            );

            console.log(
                "================================="
            );


            // =================================
            // TESTE DA RESPOSTA
            // =================================

            const respostaFinal = {

                sucesso:
                    true,

                mensagem:
                    "Rota cadastrada com sucesso!",

                codigoAcesso:
                    rotaSalva.codigo_acesso,

                rota:
                    rotaSalva

            };


            console.log(
                "[TESTE 7] Preparando resposta..."
            );

            console.log(
                "Tempo total antes de enviar:",
                Date.now() - inicioCadastro,
                "ms"
            );


            // =================================
            // RESPONDER
            // =================================

            res.status(201).json(
                respostaFinal
            );


            console.log(
                "[TESTE 8] RESPOSTA ENVIADA AO FRONTEND."
            );

            console.log(
                "Tempo TOTAL DO CADASTRO:",
                Date.now() - inicioCadastro,
                "ms"
            );

            console.log(
                "================================="
            );

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
                "Tempo até o erro:",
                Date.now() - inicioCadastro,
                "ms"
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

        const inicio =
            Date.now();

        console.log(
            "[LISTAR ROTAS] Iniciando consulta..."
        );

        try {

            const resultado =
                await pool.query(

                    `
                    SELECT *
                    FROM rotas
                    ORDER BY id DESC
                    `

                );

            console.log(
                "[LISTAR ROTAS] Consulta terminou em:",
                Date.now() - inicio,
                "ms"
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

        const inicio =
            Date.now();

        try {

            const id =
                req.params.id;


            console.log(
                "[BUSCAR ROTA] ID:",
                id
            );


            const resultado =
                await pool.query(

                    `
                    SELECT *
                    FROM rotas
                    WHERE id = $1
                    `,

                    [id]

                );


            console.log(
                "[BUSCAR ROTA] Consulta terminou em:",
                Date.now() - inicio,
                "ms"
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

        const inicioEdicao =
            Date.now();

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


            console.log(
                "[EDIÇÃO] Executando UPDATE..."
            );


            const inicioUpdate =
                Date.now();


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


            console.log(
                "[EDIÇÃO] UPDATE terminou em:",
                Date.now() - inicioUpdate,
                "ms"
            );


            if (
                resultado.rows.length === 0
            ) {

                return res.status(404).json({

                    mensagem:
                        "Rota não encontrada."

                });

            }


            console.log(
                "[EDIÇÃO] Tempo total:",
                Date.now() - inicioEdicao,
                "ms"
            );


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
                "Tempo até o erro:",
                Date.now() - inicioEdicao,
                "ms"
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

        const inicio =
            Date.now();

        console.log(
            "================================="
        );

        console.log(
            "TESTE DO BANCO INICIADO"
        );

        try {

            console.log(
                "Executando COUNT(*)..."
            );


            const resultado =
                await pool.query(
                    "SELECT COUNT(*) AS total FROM rotas"
                );


            const tempo =
                Date.now() - inicio;


            console.log(
                "Banco respondeu em:",
                tempo,
                "ms"
            );


            res.json({

                mensagem:
                    "Banco conectado corretamente.",

                totalRotas:
                    resultado.rows[0].total,

                tempoMs:
                    tempo

            });

        }

        catch (erro) {

            console.error(
                "Erro no teste do banco:",
                erro
            );

            console.error(
                "Tempo até o erro:",
                Date.now() - inicio,
                "ms"
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
// TESTE DE SAÚDE DA API
// =========================================

app.get(
    "/health",
    function (req, res) {

        res.status(200).json({

            status:
                "ok",

            mensagem:
                "API do Transporte Fácil funcionando.",

            horario:
                new Date().toISOString()

        });

    }
);


// =========================================
// SERVIDOR
// =========================================

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    async function () {

        console.log(
            "================================="
        );

        console.log(
            "SERVIDOR TRANSPORTE FÁCIL"
        );

        console.log(
            `Servidor rodando na porta ${PORT}`
        );

        console.log(
            "Horário de inicialização:",
            new Date().toISOString()
        );

        console.log(
            "================================="
        );


        // =====================================
        // TESTAR BANCO AO INICIAR
        // =====================================

        const inicioBanco =
            Date.now();


        try {

            console.log(
                "Testando conexão com PostgreSQL..."
            );


            const resultado =
                await pool.query(
                    "SELECT NOW()"
                );


            console.log(
                "PostgreSQL conectado com sucesso!"
            );

            console.log(
                "Horário do banco:",
                resultado.rows[0].now
            );

            console.log(
                "Tempo da conexão inicial:",
                Date.now() - inicioBanco,
                "ms"
            );

            console.log(
                "================================="
            );

        }

        catch (erro) {

            console.error(
                "================================="
            );

            console.error(
                "ERRO NA CONEXÃO INICIAL COM POSTGRESQL:"
            );

            console.error(
                erro
            );

            console.error(
                "Tempo até o erro:",
                Date.now() - inicioBanco,
                "ms"
            );

            console.error(
                "================================="
            );

        }

    }
);