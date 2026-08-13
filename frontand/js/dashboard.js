// =========================================
// DASHBOARD ADMINISTRATIVO
// TRANSPORTE FÁCIL
// =========================================


// =========================================
// PROTEÇÃO DO DASHBOARD
// =========================================

const adminLogado =
    sessionStorage.getItem("adminLogado");

if (adminLogado !== "true") {

    window.location.href =
        "login_admin.html";

}


// =========================================
// ENDEREÇO DA API
// =========================================

const API_URL =
    "https://transporte-facil-api.onrender.com";


// =========================================
// ELEMENTOS DA TELA
// =========================================

const btnSair =
    document.getElementById("btnSair");

const btnAdicionarRota =
    document.getElementById("btnAdicionarRota");

const cardsAcao =
    document.querySelectorAll(".card-acao");


// =========================================
// BOTÃO SAIR
// =========================================

if (btnSair) {

    btnSair.addEventListener(
        "click",
        function () {

            const confirmar =
                confirm(
                    "Deseja realmente sair do painel administrativo?"
                );


            if (confirmar) {

                sessionStorage.removeItem(
                    "adminLogado"
                );


                window.location.href =
                    "tela_inicial.html";

            }

        }
    );

}


// =========================================
// AÇÕES DE GERENCIAMENTO
// =========================================

cardsAcao.forEach(
    function (card) {

        card.addEventListener(
            "click",
            function () {

                const acao =
                    card.dataset.acao;


                // =================================
                // ROTAS
                // =================================

                if (acao === "rotas") {

                    window.location.href =
                        "criar_rota.html";

                }


                // =================================
                // HORÁRIOS
                // =================================

                else if (
                    acao === "horarios"
                ) {

                    alert(
                        "Área de gerenciamento de horários em desenvolvimento."
                    );

                }


                // =================================
                // VEÍCULOS
                // =================================

                else if (
                    acao === "veiculos"
                ) {

                    alert(
                        "Área de gerenciamento de veículos em desenvolvimento."
                    );

                }


                // =================================
                // AGÊNCIAS
                // =================================

                else if (
                    acao === "agencias"
                ) {

                    alert(
                        "Área de gerenciamento de agências em desenvolvimento."
                    );

                }

            }
        );

    }
);


// =========================================
// BOTÃO ADICIONAR ROTA
// =========================================

if (btnAdicionarRota) {

    btnAdicionarRota.addEventListener(
        "click",
        function () {

            window.location.href =
                "criar_rota.html";

        }
    );

}


// =========================================
// CONVERTER DIAS
// =========================================

function formatarDias(dias) {

    if (!dias) {

        return "Não informado";

    }


    const nomesDias = {

        segunda:
            "Segunda",

        terca:
            "Terça",

        quarta:
            "Quarta",

        quinta:
            "Quinta",

        sexta:
            "Sexta",

        sabado:
            "Sábado",

        domingo:
            "Domingo"

    };


    const listaDias =
        dias
            .split(",")
            .map(
                function (dia) {

                    return (
                        nomesDias[
                            dia.trim()
                        ]
                        ||
                        dia.trim()
                    );

                }
            );


    return listaDias.join(", ");

}


// =========================================
// FORMATAR TIPO DE TRANSPORTE
// =========================================

function formatarTipo(tipo) {

    if (tipo === "van") {

        return "🚐 Van";

    }


    if (tipo === "onibus") {

        return "🚌 Ônibus";

    }


    return "🚍 Transporte";

}


// =========================================
// FORMATAR HORÁRIOS
// =========================================

function formatarHorarios(horarios) {

    // =================================
    // CASO NÃO TENHA HORÁRIOS
    // =================================

    if (!horarios) {

        return `
            <p>
                🕐 Horários: Não informado
            </p>
        `;

    }


    // =================================
    // CASO O POSTGRESQL DEVOLVA
    // O JSON COMO TEXTO
    // =================================

    if (
        typeof horarios === "string"
    ) {

        try {

            horarios =
                JSON.parse(horarios);

        }

        catch (erro) {

            console.error(
                "Erro ao interpretar horários:",
                erro
            );

            return `
                <p>
                    🕐 Horários: Não informado
                </p>
            `;

        }

    }


    // =================================
    // FUNÇÃO PARA MONTAR UM PERÍODO
    // =================================

    function montarPeriodo(
        titulo,
        lista
    ) {

        if (
            !Array.isArray(lista) ||
            lista.length === 0
        ) {

            return "";

        }


        let html = `

            <div class="periodo-horarios">

                <strong>
                    ${titulo}
                </strong>

        `;


        lista.forEach(
            function (horario) {

                const saida =
                    horario.saida ||
                    "--:--";

                const chegada =
                    horario.chegada ||
                    "--:--";


                html += `

                    <div class="horario-item">

                        <span>
                            🕐 ${saida}
                        </span>

                        <span>
                            →
                        </span>

                        <span>
                            ${chegada}
                        </span>

                    </div>

                `;

            }
        );


        html += `

            </div>

        `;


        return html;

    }


    // =================================
    // MONTAR TODOS OS PERÍODOS
    // =================================

    let html = "";


    html +=
        montarPeriodo(
            "Segunda a sexta",
            horarios.segunda_sexta
        );


    html +=
        montarPeriodo(
            "Sábado",
            horarios.sabado
        );


    html +=
        montarPeriodo(
            "Domingo",
            horarios.domingo
        );


    // =================================
    // NENHUM HORÁRIO ENCONTRADO
    // =================================

    if (!html) {

        return `

            <p>
                🕐 Horários: Não informado
            </p>

        `;

    }


    // =================================
    // RETORNAR HTML
    // =================================

    return `

        <div class="horarios-rota">

            <p>
                🕐 <strong>Horários</strong>
            </p>

            ${html}

        </div>

    `;

}


// =========================================
// EDITAR ROTA
// =========================================

function editarRota(id) {

    if (!id) {

        alert(
            "Não foi possível identificar esta rota."
        );

        return;

    }


    window.location.href =
        "criar_rota.html?id=" + id;

}


// =========================================
// EXCLUIR ROTA
// =========================================

async function excluirRota(
    id,
    nome
) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta rota?\n\n" +
            nome +
            "\n\n" +
            "Essa ação não poderá ser desfeita."
        );


    if (!confirmar) {

        return;

    }


    try {

        const resposta =
            await fetch(
                API_URL +
                "/rotas/" +
                id,
                {
                    method:
                        "DELETE"
                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Erro ao excluir a rota."
            );

        }


        alert(
            "Rota excluída com sucesso!"
        );


        carregarRotas();

    }

    catch (erro) {

        console.error(
            "Erro ao excluir rota:",
            erro
        );


        alert(
            "Não foi possível excluir a rota."
        );

    }

}


// =========================================
// MOSTRAR ROTAS NA TELA
// =========================================

function mostrarRotas(rotas) {

    const listaRotas =
        document.getElementById(
            "listaRotas"
        );


    if (!listaRotas) {

        console.error(
            "Elemento #listaRotas não encontrado."
        );

        return;

    }


    listaRotas.innerHTML = "";


    if (
        !rotas ||
        rotas.length === 0
    ) {

        listaRotas.innerHTML = `

            <p>
                Nenhuma rota cadastrada.
            </p>

        `;

        return;

    }


    rotas.forEach(
        function (rota) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "card-rota";


            const icone =
                rota.tipo === "van"
                    ? "🚐"
                    : "🚌";


            const diasFormatados =
                formatarDias(
                    rota.dias
                );


            const tipoFormatado =
                formatarTipo(
                    rota.tipo
                );


            const informacoes =
                rota.informacoes ||
                "Nenhuma informação adicional.";


            // =================================
            // HORÁRIOS
            // =================================

            const horariosFormatados =
                formatarHorarios(
                    rota.horarios
                );


            // =================================
            // CARD
            // =================================

            card.innerHTML = `

                <div class="icone-rota">

                    ${icone}

                </div>


                <div class="info-rota">

                    <h3>
                        ${rota.nome}
                    </h3>


                    <p>

                        ${rota.origem}

                        →

                        ${rota.destino}

                    </p>


                    <p>

                        ${tipoFormatado}

                    </p>


                    ${horariosFormatados}


                    <p>

                        📅 ${diasFormatados}

                    </p>


                    <p>

                        📝 ${informacoes}

                    </p>

                </div>


                <span class="status ativo">

                    Ativa

                </span>


                <div class="acoes-rota">

                    <button
                        class="btn-editar"
                        type="button"
                    >

                        Editar

                    </button>


                    <button
                        class="btn-excluir"
                        type="button"
                    >

                        Excluir

                    </button>

                </div>

            `;


            listaRotas.appendChild(
                card
            );


            // =================================
            // BOTÃO EDITAR
            // =================================

            const botaoEditar =
                card.querySelector(
                    ".btn-editar"
                );


            botaoEditar.addEventListener(
                "click",
                function () {

                    editarRota(
                        rota.id
                    );

                }
            );


            // =================================
            // BOTÃO EXCLUIR
            // =================================

            const botaoExcluir =
                card.querySelector(
                    ".btn-excluir"
                );


            botaoExcluir.addEventListener(
                "click",
                function () {

                    excluirRota(
                        rota.id,
                        rota.nome
                    );

                }
            );

        }
    );

}


// =========================================
// BUSCAR ROTAS DO BANCO
// =========================================

async function carregarRotas() {

    try {

        const resposta =
            await fetch(
                API_URL +
                "/rotas"
            );


        // =================================
        // VERIFICAR RESPOSTA
        // =================================

        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar as rotas."
            );

        }


        // =================================
        // CONVERTER RESPOSTA
        // =================================

        const dados =
            await resposta.json();


        console.log(
            "Rotas recebidas do banco:",
            dados.rotas
        );


        // =================================
        // MOSTRAR ROTAS
        // =================================

        mostrarRotas(
            dados.rotas
        );


        // =================================
        // ATUALIZAR TOTAL DE ROTAS
        // =================================

        const totalRotas =
            document.getElementById(
                "totalRotas"
            );


        if (totalRotas) {

            totalRotas.textContent =
                dados.rotas.length;

        }

    }

    catch (erro) {

        console.error(
            "Erro ao carregar rotas:",
            erro
        );


        const listaRotas =
            document.getElementById(
                "listaRotas"
            );


        if (listaRotas) {

            listaRotas.innerHTML = `

                <p>
                    Não foi possível carregar as rotas.
                </p>

            `;

        }

    }

}


// =========================================
// EXECUTAR AO ABRIR O DASHBOARD
// =========================================

carregarRotas();