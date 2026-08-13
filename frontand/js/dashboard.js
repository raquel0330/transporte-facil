// =========================================
// DASHBOARD ADMINISTRATIVO
// TRANSPORTE FÁCIL
// =========================================

// URL DA API
const API_URL = "https://transporte-facil-api.onrender.com";


// =========================================
// ELEMENTOS
// =========================================

const listaRotas = document.getElementById("listaRotas");
const totalRotas = document.getElementById("totalRotas");
const totalHorarios = document.getElementById("totalHorarios");
const btnAdicionarRota = document.getElementById("btnAdicionarRota");
const btnSair = document.getElementById("btnSair");


// =========================================
// INICIALIZAÇÃO
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    carregarRotas();

    configurarBotoes();

});


// =========================================
// CONFIGURAR BOTÕES
// =========================================

function configurarBotoes() {

    // -----------------------------------------
    // SAIR
    // -----------------------------------------

    if (btnSair) {

        btnSair.addEventListener(
            "click",
            function () {

                const confirmar =
                    confirm(
                        "Deseja realmente sair do painel administrativo?"
                    );

                if (!confirmar) {
                    return;
                }

                window.location.href =
                    "tela_inicial.html";

            }
        );

    }


    // -----------------------------------------
    // ADICIONAR ROTA
    // -----------------------------------------

    if (btnAdicionarRota) {

        btnAdicionarRota.addEventListener(
            "click",
            function () {

                abrirFormularioRota();

            }
        );

    }


    // -----------------------------------------
    // CARDS DE GERENCIAMENTO
    // -----------------------------------------

    const botoesAcao =
        document.querySelectorAll(
            ".card-acao"
        );


    botoesAcao.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    const acao =
                        botao.dataset.acao;


                    if (acao === "rotas") {

                        document
                            .querySelector(
                                ".lista-rotas"
                            )
                            ?.scrollIntoView({
                                behavior: "smooth"
                            });

                        return;

                    }


                    if (acao === "horarios") {

                        abrirGerenciamentoHorarios();

                        return;

                    }


                    if (acao === "veiculos") {

                        alert(
                            "A área de gerenciamento de veículos será disponibilizada em breve."
                        );

                        return;

                    }


                    if (acao === "agencias") {

                        alert(
                            "A área de gerenciamento de agências será disponibilizada em breve."
                        );

                        return;

                    }

                }
            );

        }
    );

}


// =========================================
// CARREGAR ROTAS
// =========================================

async function carregarRotas() {

    if (!listaRotas) {
        return;
    }


    listaRotas.innerHTML = `
        <p>
            Carregando rotas...
        </p>
    `;


    try {

        const resposta =
            await fetch(
                `${API_URL}/rotas`
            );


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar as rotas."
            );

        }


        const dados =
            await resposta.json();


        const rotas =
            Array.isArray(dados.rotas)
                ? dados.rotas
                : [];


        atualizarResumo(rotas);

        renderizarRotas(rotas);


    }

    catch (erro) {

        console.error(
            "Erro ao carregar rotas:",
            erro
        );


        listaRotas.innerHTML = `
            <div class="erro-dashboard">

                <strong>
                    Não foi possível carregar as rotas.
                </strong>

                <p>
                    Verifique sua conexão com a API.
                </p>

                <button
                    type="button"
                    onclick="carregarRotas()"
                >
                    Tentar novamente
                </button>

            </div>
        `;

    }

}


// =========================================
// ATUALIZAR RESUMO
// =========================================

function atualizarResumo(rotas) {

    if (totalRotas) {

        totalRotas.textContent =
            rotas.length;

    }


    let quantidadeHorarios = 0;


    rotas.forEach(
        function (rota) {

            const horarios =
                obterHorarios(rota);

            quantidadeHorarios +=
                horarios.length;

        }
    );


    if (totalHorarios) {

        totalHorarios.textContent =
            quantidadeHorarios;

    }

}


// =========================================
// RENDERIZAR ROTAS
// =========================================

function renderizarRotas(rotas) {

    if (!listaRotas) {
        return;
    }


    if (rotas.length === 0) {

        listaRotas.innerHTML = `

            <div class="rota-vazia">

                <div>
                    🚌
                </div>

                <h3>
                    Nenhuma rota cadastrada
                </h3>

                <p>
                    Cadastre a primeira rota
                    utilizando o botão acima.
                </p>

            </div>

        `;

        return;

    }


    listaRotas.innerHTML = "";


    rotas.forEach(
        function (rota) {

            const card =
                criarCardRota(rota);

            listaRotas.appendChild(card);

        }
    );

}


// =========================================
// CRIAR CARD DA ROTA
// =========================================

function criarCardRota(rota) {

    const card =
        document.createElement("div");


    card.className =
        "card-rota";


    const horarios =
        obterHorarios(rota);


    const dias =
        obterDias(rota);


    const horariosHTML =
        horarios.length > 0

            ? horarios
                .map(
                    function (horario) {

                        return `
                            <span class="horario-item">
                                🕐
                                <strong>
                                    ${escaparHTML(
                                        horario.saida
                                    )}
                                </strong>

                                →

                                <strong>
                                    ${escaparHTML(
                                        horario.chegada
                                    )}
                                </strong>
                            </span>
                        `;

                    }
                )
                .join("")

            : `
                <span class="horario-item">
                    Não informado
                </span>
            `;


    const diasHTML =
        dias.length > 0
            ? dias
                .map(
                    function (dia) {

                        return `
                            <span class="dia-item">
                                ${escaparHTML(dia)}
                            </span>
                        `;

                    }
                )
                .join("")
            : "Não informado";


    card.innerHTML = `

        <div class="rota-cabecalho">

            <div>

                <span class="rota-tipo">
                    ${escaparHTML(
                        rota.tipo || "Transporte"
                    )}
                </span>

                <h3>
                    ${escaparHTML(
                        rota.nome || "Rota sem nome"
                    )}
                </h3>

            </div>

            <span class="rota-id">
                #${escaparHTML(
                    String(rota.id)
                )}
            </span>

        </div>


        <div class="rota-caminho">

            <div class="local-rota">

                <span class="icone-local">
                    📍
                </span>

                <div>

                    <small>
                        Origem
                    </small>

                    <strong>
                        ${escaparHTML(
                            rota.origem || "Não informado"
                        )}
                    </strong>

                </div>

            </div>


            <span class="seta-rota">
                →
            </span>


            <div class="local-rota">

                <span class="icone-local">
                    📍
                </span>

                <div>

                    <small>
                        Destino
                    </small>

                    <strong>
                        ${escaparHTML(
                            rota.destino || "Não informado"
                        )}
                    </strong>

                </div>

            </div>

        </div>


        ${
            rota.via
                ? `
                    <div class="informacao-rota">

                        <strong>
                            Via:
                        </strong>

                        ${escaparHTML(
                            rota.via
                        )}

                    </div>
                `
                : ""
        }


        <div class="informacoes-rota">

            <div class="info-rota">

                <small>
                    Dias
                </small>

                <div class="lista-dias">
                    ${diasHTML}
                </div>

            </div>


            <div class="info-rota">

                <small>
                    Horários
                </small>

                <div class="lista-horarios">

                    ${horariosHTML}

                </div>

            </div>

        </div>


        ${
            rota.informacoes
                ? `
                    <div class="observacao-rota">

                        <small>
                            Informações
                        </small>

                        <p>
                            ${escaparHTML(
                                rota.informacoes
                            )}
                        </p>

                    </div>
                `
                : ""
        }


        <div class="acoes-rota">

            <button
                type="button"
                class="btn-editar-rota"
                data-id="${rota.id}"
            >
                ✏️
                Editar
            </button>


            <button
                type="button"
                class="btn-excluir-rota"
                data-id="${rota.id}"
            >
                🗑️
                Excluir
            </button>

        </div>

    `;


    const btnEditar =
        card.querySelector(
            ".btn-editar-rota"
        );


    const btnExcluir =
        card.querySelector(
            ".btn-excluir-rota"
        );


    btnEditar.addEventListener(
        "click",
        function () {

            editarRota(
                rota.id
            );

        }
    );


    btnExcluir.addEventListener(
        "click",
        function () {

            excluirRota(
                rota.id
            );

        }
    );


    return card;

}


// =========================================
// OBTER HORÁRIOS
// =========================================

function obterHorarios(rota) {

    let horarios =
        rota.horarios;


    // PostgreSQL pode devolver JSON como string
    if (typeof horarios === "string") {

        try {

            horarios =
                JSON.parse(
                    horarios
                );

        }

        catch (erro) {

            console.warn(
                "Não foi possível interpretar os horários:",
                erro
            );

            return [];

        }

    }


    if (!Array.isArray(horarios)) {

        return [];

    }


    return horarios.filter(
        function (horario) {

            return (
                horario &&
                String(
                    horario.saida || ""
                ).trim() &&
                String(
                    horario.chegada || ""
                ).trim()
            );

        }
    );

}


// =========================================
// OBTER DIAS
// =========================================

function obterDias(rota) {

    if (Array.isArray(rota.dias)) {

        return rota.dias;

    }


    if (
        typeof rota.dias === "string" &&
        rota.dias.trim()
    ) {

        return rota.dias
            .split(",")
            .map(
                function (dia) {

                    return dia.trim();

                }
            )
            .filter(Boolean);

    }


    return [];

}


// =========================================
// ABRIR FORMULÁRIO
// =========================================

function abrirFormularioRota(rota = null) {

    fecharModal();


    const editando =
        rota !== null;


    const modal =
        document.createElement("div");


    modal.id =
        "modalRota";


    modal.className =
        "modal-dashboard";


    const horarios =
        editando
            ? obterHorarios(rota)
            : [
                {
                    saida: "",
                    chegada: ""
                }
            ];


    const diasSelecionados =
        editando
            ? obterDias(rota)
            : [];


    modal.innerHTML = `

        <div class="modal-conteudo">

            <div class="modal-cabecalho">

                <div>

                    <h2>
                        ${
                            editando
                                ? "Editar rota"
                                : "Adicionar nova rota"
                        }
                    </h2>

                    <p>
                        Preencha as informações da rota.
                    </p>

                </div>


                <button
                    type="button"
                    class="btn-fechar-modal"
                    id="btnFecharModal"
                >
                    ×
                </button>

            </div>


            <form
                id="formRota"
                class="form-rota"
            >

                <div class="grupo-formulario">

                    <label>
                        Empresa / Agência *
                    </label>

                    <input
                        type="text"
                        id="empresa"
                        name="empresa"
                        required
                        value="${escaparAtributo(
                            editando
                                ? rota.nome
                                : ""
                        )}"
                        placeholder="Nome da empresa ou agência"
                    >

                </div>


                <div class="grupo-formulario">

                    <label>
                        E-mail do responsável *
                    </label>

                    <input
                        type="email"
                        id="emailResponsavel"
                        name="emailResponsavel"
                        required
                        value="${escaparAtributo(
                            editando
                                ? rota.email_responsavel
                                : ""
                        )}"
                        placeholder="responsavel@email.com"
                    >

                </div>


                <div class="linha-formulario">

                    <div class="grupo-formulario">

                        <label>
                            Origem *
                        </label>

                        <input
                            type="text"
                            id="origem"
                            name="origem"
                            required
                            value="${escaparAtributo(
                                editando
                                    ? rota.origem
                                    : ""
                            )}"
                            placeholder="Cidade de origem"
                        >

                    </div>


                    <div class="grupo-formulario">

                        <label>
                            Destino *
                        </label>

                        <input
                            type="text"
                            id="destino"
                            name="destino"
                            required
                            value="${escaparAtributo(
                                editando
                                    ? rota.destino
                                    : ""
                            )}"
                            placeholder="Cidade de destino"
                        >

                    </div>

                </div>


                <div class="grupo-formulario">

                    <label>
                        Via / Paradas
                    </label>

                    <input
                        type="text"
                        id="via"
                        name="via"
                        value="${escaparAtributo(
                            editando
                                ? rota.via
                                : ""
                        )}"
                        placeholder="Ex.: Via Campo Maior"
                    >

                </div>


                <div class="grupo-formulario">

                    <label>
                        Tipo de transporte *
                    </label>

                    <select
                        id="tipo"
                        name="tipo"
                        required
                    >

                        <option value="">
                            Selecione
                        </option>

                        <option
                            value="Ônibus"
                            ${
                                editando &&
                                rota.tipo === "Ônibus"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Ônibus
                        </option>

                        <option
                            value="Van"
                            ${
                                editando &&
                                rota.tipo === "Van"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Van
                        </option>

                        <option
                            value="Micro-ônibus"
                            ${
                                editando &&
                                rota.tipo === "Micro-ônibus"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Micro-ônibus
                        </option>

                    </select>

                </div>


                <!-- ==============================
                     DIAS
                =============================== -->

                <div class="grupo-formulario">

                    <label>
                        Dias de funcionamento *
                    </label>

                    <div class="dias-checkbox">

                        ${criarCheckboxDia(
                            "Segunda",
                            diasSelecionados
                        )}

                        ${criarCheckboxDia(
                            "Terça",
                            diasSelecionados
                        )}

                        ${criarCheckboxDia(
                            "Quarta",
                            diasSelecionados
                        )}

                        ${criarCheckboxDia(
                            "Quinta",
                            diasSelecionados
                        )}

                        ${criarCheckboxDia(
                            "Sexta",
                            diasSelecionados
                        )}

                        ${criarCheckboxDia(
                            "Sábado",
                            diasSelecionados
                        )}

                        ${criarCheckboxDia(
                            "Domingo",
                            diasSelecionados
                        )}

                    </div>

                </div>


                <!-- ==============================
                     HORÁRIOS
                =============================== -->

                <div class="grupo-formulario">

                    <div class="titulo-horarios">

                        <div>

                            <label>
                                Horários das viagens *
                            </label>

                            <small>
                                Adicione quantos horários
                                forem necessários.
                            </small>

                        </div>


                        <button
                            type="button"
                            id="btnAdicionarHorario"
                            class="btn-adicionar-horario"
                        >
                            + Adicionar horário
                        </button>

                    </div>


                    <div
                        id="listaHorariosFormulario"
                        class="lista-horarios-formulario"
                    >

                    </div>

                </div>


                <!-- ==============================
                     INFORMAÇÕES
                =============================== -->

                <div class="grupo-formulario">

                    <label>
                        Informações adicionais
                    </label>

                    <textarea
                        id="informacoes"
                        name="informacoes"
                        rows="4"
                        placeholder="Informações adicionais sobre a rota..."
                    >${escaparHTML(
                        editando
                            ? rota.informacoes || ""
                            : ""
                    )}</textarea>

                </div>


                <div
                    id="mensagemFormulario"
                    class="mensagem-formulario"
                >
                </div>


                <div class="acoes-formulario">

                    <button
                        type="button"
                        id="btnCancelarFormulario"
                        class="btn-cancelar"
                    >
                        Cancelar
                    </button>


                    <button
                        type="submit"
                        class="btn-salvar"
                    >
                        ${
                            editando
                                ? "Salvar alterações"
                                : "Cadastrar rota"
                        }
                    </button>

                </div>

            </form>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    // -----------------------------------------
    // CRIAR HORÁRIOS
    // -----------------------------------------

    const listaHorariosFormulario =
        document.getElementById(
            "listaHorariosFormulario"
        );


    horarios.forEach(
        function (horario) {

            adicionarCampoHorario(
                horario.saida,
                horario.chegada
            );

        }
    );


    // -----------------------------------------
    // BOTÃO ADICIONAR HORÁRIO
    // -----------------------------------------

    document
        .getElementById(
            "btnAdicionarHorario"
        )
        .addEventListener(
            "click",
            function () {

                adicionarCampoHorario(
                    "",
                    ""
                );

            }
        );


    // -----------------------------------------
    // FECHAR
    // -----------------------------------------

    document
        .getElementById(
            "btnFecharModal"
        )
        .addEventListener(
            "click",
            fecharModal
        );


    document
        .getElementById(
            "btnCancelarFormulario"
        )
        .addEventListener(
            "click",
            fecharModal
        );


    // -----------------------------------------
    // FORMULÁRIO
    // -----------------------------------------

    document
        .getElementById(
            "formRota"
        )
        .addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();


                if (editando) {

                    salvarEdicao(
                        rota.id
                    );

                }

                else {

                    cadastrarRota();

                }

            }
        );

}


// =========================================
// CRIAR CHECKBOX DE DIA
// =========================================

function criarCheckboxDia(
    dia,
    selecionados
) {

    const marcado =
        selecionados.includes(dia)
            ? "checked"
            : "";


    return `

        <label class="checkbox-dia">

            <input
                type="checkbox"
                name="dias"
                value="${escaparAtributo(dia)}"
                ${marcado}
            >

            <span>
                ${escaparHTML(dia)}
            </span>

        </label>

    `;

}


// =========================================
// ADICIONAR CAMPO DE HORÁRIO
// =========================================

function adicionarCampoHorario(
    saida = "",
    chegada = ""
) {

    const lista =
        document.getElementById(
            "listaHorariosFormulario"
        );


    if (!lista) {
        return;
    }


    const linha =
        document.createElement("div");


    linha.className =
        "linha-horario";


    linha.innerHTML = `

        <div class="campo-horario">

            <label>
                Saída
            </label>

            <input
                type="time"
                class="input-saida"
                value="${escaparAtributo(saida)}"
            >

        </div>


        <div class="campo-horario">

            <label>
                Chegada
            </label>

            <input
                type="time"
                class="input-chegada"
                value="${escaparAtributo(chegada)}"
            >

        </div>


        <button
            type="button"
            class="btn-remover-horario"
            title="Remover horário"
        >
            ×
        </button>

    `;


    linha
        .querySelector(
            ".btn-remover-horario"
        )
        .addEventListener(
            "click",
            function () {

                linha.remove();

            }
        );


    lista.appendChild(
        linha
    );

}


// =========================================
// COLETAR HORÁRIOS DO FORMULÁRIO
// =========================================

function coletarHorarios() {

    const linhas =
        document.querySelectorAll(
            "#listaHorariosFormulario .linha-horario"
        );


    const horarios = [];


    linhas.forEach(
        function (linha) {

            const saida =
                linha
                    .querySelector(
                        ".input-saida"
                    )
                    ?.value
                    .trim();


            const chegada =
                linha
                    .querySelector(
                        ".input-chegada"
                    )
                    ?.value
                    .trim();


            // Ignora linha completamente vazia
            if (
                !saida &&
                !chegada
            ) {

                return;

            }


            horarios.push({

                saida:
                    saida,

                chegada:
                    chegada

            });

        }
    );


    return horarios;

}


// =========================================
// COLETAR DADOS DO FORMULÁRIO
// =========================================

function coletarDadosFormulario() {

    const dias =
        Array.from(
            document.querySelectorAll(
                'input[name="dias"]:checked'
            )
        )
        .map(
            function (checkbox) {

                return checkbox.value;

            }
        );


    const horarios =
        coletarHorarios();


    return {

        empresa:
            document
                .getElementById(
                    "empresa"
                )
                .value
                .trim(),

        emailResponsavel:
            document
                .getElementById(
                    "emailResponsavel"
                )
                .value
                .trim(),

        origem:
            document
                .getElementById(
                    "origem"
                )
                .value
                .trim(),

        destino:
            document
                .getElementById(
                    "destino"
                )
                .value
                .trim(),

        via:
            document
                .getElementById(
                    "via"
                )
                .value
                .trim(),

        tipo:
            document
                .getElementById(
                    "tipo"
                )
                .value
                .trim(),

        dias:
            dias,

        horarios:
            horarios,

        informacoes:
            document
                .getElementById(
                    "informacoes"
                )
                .value
                .trim()

    };

}


// =========================================
// VALIDAR FORMULÁRIO
// =========================================

function validarFormulario(dados) {

    const erros = [];


    if (!dados.empresa) {

        erros.push(
            "Informe a empresa/agência."
        );

    }


    if (!dados.emailResponsavel) {

        erros.push(
            "Informe o e-mail do responsável."
        );

    }


    if (
        dados.emailResponsavel &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(
                dados.emailResponsavel
            )
    ) {

        erros.push(
            "Informe um e-mail válido."
        );

    }


    if (!dados.origem) {

        erros.push(
            "Informe a origem."
        );

    }


    if (!dados.destino) {

        erros.push(
            "Informe o destino."
        );

    }


    if (!dados.tipo) {

        erros.push(
            "Selecione o tipo de transporte."
        );

    }


    if (
        !Array.isArray(dados.dias) ||
        dados.dias.length === 0
    ) {

        erros.push(
            "Selecione pelo menos um dia de funcionamento."
        );

    }


    if (
        !Array.isArray(dados.horarios) ||
        dados.horarios.length === 0
    ) {

        erros.push(
            "Adicione pelo menos um horário."
        );

    }


    dados.horarios.forEach(
        function (horario, indice) {

            if (
                !horario.saida ||
                !horario.chegada
            ) {

                erros.push(
                    `Preencha a saída e a chegada do horário ${indice + 1}.`
                );

            }

        }
    );


    return erros;

}


// =========================================
// CADASTRAR ROTA
// =========================================

async function cadastrarRota() {

    const dados =
        coletarDadosFormulario();


    const erros =
        validarFormulario(
            dados
        );


    if (erros.length > 0) {

        mostrarMensagemFormulario(
            erros.join("<br>"),
            "erro"
        );

        return;

    }


    const botao =
        document.querySelector(
            "#formRota .btn-salvar"
        );


    if (botao) {

        botao.disabled =
            true;

        botao.textContent =
            "Cadastrando...";

    }


    try {

        const resposta =
            await fetch(
                `${API_URL}/rotas`,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            dados
                        )

                }
            );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            const mensagem =
                resultado.camposPendentes
                    ? resultado.camposPendentes.join(
                        "<br>"
                    )
                    : resultado.mensagem ||
                      "Erro ao cadastrar rota.";

            throw new Error(
                mensagem
            );

        }


        mostrarMensagemFormulario(
            `
                ${escaparHTML(
                    resultado.mensagem ||
                    "Rota cadastrada com sucesso!"
                )}

                ${
                    resultado.codigoAcesso
                        ? `<br><strong>Código de acesso:</strong> ${escaparHTML(resultado.codigoAcesso)}`
                        : ""
                }
            `,
            "sucesso"
        );


        setTimeout(
            function () {

                fecharModal();

                carregarRotas();

            },
            1800
        );


    }

    catch (erro) {

        console.error(
            "Erro ao cadastrar rota:",
            erro
        );


        mostrarMensagemFormulario(
            erro.message ||
            "Erro ao cadastrar rota.",
            "erro"
        );


        if (botao) {

            botao.disabled =
                false;

            botao.textContent =
                "Cadastrar rota";

        }

    }

}


// =========================================
// EDITAR ROTA
// =========================================

async function editarRota(id) {

    try {

        const resposta =
            await fetch(
                `${API_URL}/rotas/${id}`
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Não foi possível buscar a rota."
            );

        }


        abrirFormularioRota(
            dados.rota
        );

    }

    catch (erro) {

        console.error(
            "Erro ao buscar rota:",
            erro
        );


        alert(
            erro.message ||
            "Erro ao buscar rota."
        );

    }

}


// =========================================
// SALVAR EDIÇÃO
// =========================================

async function salvarEdicao(id) {

    const dados =
        coletarDadosFormulario();


    const erros =
        validarFormulario(
            dados
        );


    if (erros.length > 0) {

        mostrarMensagemFormulario(
            erros.join("<br>"),
            "erro"
        );

        return;

    }


    const botao =
        document.querySelector(
            "#formRota .btn-salvar"
        );


    if (botao) {

        botao.disabled =
            true;

        botao.textContent =
            "Salvando...";

    }


    try {

        const resposta =
            await fetch(
                `${API_URL}/rotas/${id}`,
                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            dados
                        )

                }
            );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            const mensagem =
                resultado.camposPendentes
                    ? resultado.camposPendentes.join(
                        "<br>"
                    )
                    : resultado.mensagem ||
                      "Erro ao atualizar rota.";

            throw new Error(
                mensagem
            );

        }


        mostrarMensagemFormulario(
            resultado.mensagem ||
            "Rota atualizada com sucesso!",
            "sucesso"
        );


        setTimeout(
            function () {

                fecharModal();

                carregarRotas();

            },
            1200
        );

    }

    catch (erro) {

        console.error(
            "Erro ao editar rota:",
            erro
        );


        mostrarMensagemFormulario(
            erro.message ||
            "Erro ao atualizar rota.",
            "erro"
        );


        if (botao) {

            botao.disabled =
                false;

            botao.textContent =
                "Salvar alterações";

        }

    }

}


// =========================================
// EXCLUIR ROTA
// =========================================

async function excluirRota(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta rota?\n\nEssa ação não poderá ser desfeita."
        );


    if (!confirmar) {
        return;
    }


    try {

        const resposta =
            await fetch(
                `${API_URL}/rotas/${id}`,
                {

                    method:
                        "DELETE"

                }
            );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                resultado.mensagem ||
                "Não foi possível excluir a rota."
            );

        }


        alert(
            resultado.mensagem ||
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
            erro.message ||
            "Erro ao excluir rota."
        );

    }

}


// =========================================
// GERENCIAMENTO DE HORÁRIOS
// =========================================

function abrirGerenciamentoHorarios() {

    document
        .querySelector(
            ".lista-rotas"
        )
        ?.scrollIntoView({
            behavior: "smooth"
        });


    alert(
        "Os horários são gerenciados dentro de cada rota. Clique em \"Editar\" em uma rota para adicionar, alterar ou remover horários."
    );

}


// =========================================
// MOSTRAR MENSAGEM
// =========================================

function mostrarMensagemFormulario(
    mensagem,
    tipo
) {

    const elemento =
        document.getElementById(
            "mensagemFormulario"
        );


    if (!elemento) {
        return;
    }


    elemento.className =
        `mensagem-formulario ${tipo}`;


    elemento.innerHTML =
        mensagem;

}


// =========================================
// FECHAR MODAL
// =========================================

function fecharModal() {

    const modal =
        document.getElementById(
            "modalRota"
        );


    if (modal) {

        modal.remove();

    }

}


// =========================================
// ESCAPAR HTML
// =========================================

function escaparHTML(valor) {

    if (
        valor === undefined ||
        valor === null
    ) {

        return "";

    }


    return String(valor)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================================
// ESCAPAR ATRIBUTO
// =========================================

function escaparAtributo(valor) {

    return escaparHTML(
        valor
    );

}


// =========================================
// EXPOR FUNÇÕES
// =========================================

window.carregarRotas =
    carregarRotas;

window.editarRota =
    editarRota;

window.excluirRota =
    excluirRota;

window.abrirFormularioRota =
    abrirFormularioRota;