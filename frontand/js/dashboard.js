// =========================================
// DASHBOARD ADMINISTRATIVO
// TRANSPORTE FÁCIL
// =========================================


// =========================================
// URL DA API
// =========================================

const API_URL =
    "https://transporte-facil-api.onrender.com";


// =========================================
// ELEMENTOS
// =========================================

const listaRotas =
    document.getElementById("listaRotas");

const totalRotas =
    document.getElementById("totalRotas");

const totalHorarios =
    document.getElementById("totalHorarios");

const btnAdicionarRota =
    document.getElementById("btnAdicionarRota");

const btnSair =
    document.getElementById("btnSair");


// =========================================
// INICIALIZAÇÃO
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        configurarBotoes();

        carregarRotas();

    }
);


// =========================================
// CONFIGURAR BOTÕES
// =========================================

function configurarBotoes() {

    // =====================================
    // SAIR
    // =====================================

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


    // =====================================
    // ADICIONAR ROTA
    // =====================================

    if (btnAdicionarRota) {

        btnAdicionarRota.addEventListener(
            "click",
            function () {

                abrirFormularioRota();

            }
        );

    }


    // =====================================
    // CARDS DE GERENCIAMENTO
    // =====================================

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


                    // ---------------------------------
                    // ROTAS
                    // ---------------------------------

                    if (acao === "rotas") {

                        document
                            .querySelector(
                                ".lista-rotas"
                            )
                            ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        return;

                    }


                    // ---------------------------------
                    // HORÁRIOS
                    // ---------------------------------

                    if (acao === "horarios") {

                        abrirGerenciamentoHorarios();

                        return;

                    }


                    // ---------------------------------
                    // VEÍCULOS
                    // ---------------------------------

                    if (acao === "veiculos") {

                        alert(
                            "O gerenciamento de veículos ainda não está conectado à API."
                        );

                        return;

                    }


                    // ---------------------------------
                    // AGÊNCIAS
                    // ---------------------------------

                    if (acao === "agencias") {

                        alert(
                            "O gerenciamento de agências ainda não está conectado à API."
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
        <div class="estado-carregamento">
            <p>🚌 Carregando rotas...</p>
        </div>
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


        if (totalRotas) {
            totalRotas.textContent = "—";
        }


        if (totalHorarios) {
            totalHorarios.textContent = "—";
        }


        listaRotas.innerHTML = `

            <div class="erro-dashboard">

                <strong>
                    Não foi possível carregar as rotas.
                </strong>

                <p>
                    Verifique sua conexão com a API
                    ou tente novamente.
                </p>

                <button
                    type="button"
                    id="btnTentarNovamente"
                >
                    Tentar novamente
                </button>

            </div>

        `;


        const btnTentarNovamente =
            document.getElementById(
                "btnTentarNovamente"
            );


        if (btnTentarNovamente) {

            btnTentarNovamente.addEventListener(
                "click",
                carregarRotas
            );

        }

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

                <div class="icone-rota-vazia">
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
        document.createElement("article");


    card.className =
        "card-rota";


    const horarios =
        obterHorarios(rota);


    const dias =
        obterDias(rota);


    // =====================================
    // HORÁRIOS
    // =====================================

    let horariosHTML = "";


    if (horarios.length > 0) {

        horariosHTML =
            horarios
                .map(
                    function (horario) {

                        return `

                            <div class="horario-item">

                                <span class="icone-horario">
                                    🕐
                                </span>

                                <span>
                                    ${escaparHTML(
                                        horario.saida
                                    )}
                                </span>

                                <span>
                                    →
                                </span>

                                <span>
                                    ${escaparHTML(
                                        horario.chegada
                                    )}
                                </span>

                            </div>

                        `;

                    }
                )
                .join("");

    }

    else {

        horariosHTML = `

            <div class="horario-item">

                <span class="icone-horario">
                    🕐
                </span>

                <span>
                    Não informado
                </span>

            </div>

        `;

    }


    // =====================================
    // DIAS
    // =====================================

    let diasHTML = "";


    if (dias.length > 0) {

        diasHTML =
            dias
                .map(
                    function (dia) {

                        return `

                            <span class="dia-item">
                                ${escaparHTML(dia)}
                            </span>

                        `;

                    }
                )
                .join("");

    }

    else {

        diasHTML = `

            <span class="dia-item">
                Não informado
            </span>

        `;

    }


    // =====================================
    // CARD
    // =====================================

    card.innerHTML = `

        <div class="rota-cabecalho">

    <div>

        <span class="rota-tipo">
            ${escaparHTML(
                rota.tipo ||
                "Transporte"
            )}
        </span>

        <h3>
            ${escaparHTML(
                rota.nome ||
                "Rota sem nome"
            )}
        </h3>

        <span class="rota-status ativo">
            ● Ativo
        </span>

    </div>

    <span class="rota-id">
        #${escaparHTML(
            String(
                rota.id ?? ""
            )
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
                            rota.origem ||
                            "Não informado"
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
                            rota.destino ||
                            "Não informado"
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
                    Dias de funcionamento
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
                            Informações adicionais
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


        ${
            rota.email_responsavel
                ? `

                    <div class="responsavel-rota">

                        <small>
                            Responsável
                        </small>

                        <span>
                            ${escaparHTML(
                                rota.email_responsavel
                            )}
                        </span>

                    </div>

                `
                : ""
        }


        ${
            rota.codigo_acesso
                ? `

                    <div class="codigo-acesso-rota">

                        <div>

                            <small>
                                Código de acesso
                            </small>

                            <strong>
                                ${escaparHTML(
                                    rota.codigo_acesso
                                )}
                            </strong>

                        </div>


                        <button
                            type="button"
                            class="btn-copiar-codigo"
                            data-codigo="${escaparAtributo(
                                rota.codigo_acesso
                            )}"
                        >
                            Copiar
                        </button>

                    </div>

                `
                : ""
        }


        <div class="acoes-rota">

            <button
                type="button"
                class="btn-editar-rota"
                data-id="${escaparAtributo(
                    rota.id
                )}"
            >
                ✏️
                Editar
            </button>


            <button
                type="button"
                class="btn-excluir-rota"
                data-id="${escaparAtributo(
                    rota.id
                )}"
            >
                🗑️
                Excluir
            </button>

        </div>

    `;


    // =====================================
    // EDITAR
    // =====================================

    const btnEditar =
        card.querySelector(
            ".btn-editar-rota"
        );


    if (btnEditar) {

        btnEditar.addEventListener(
            "click",
            function () {

                const id =
                    btnEditar.dataset.id;

                editarRota(id);

            }
        );

    }


    // =====================================
    // EXCLUIR
    // =====================================

    const btnExcluir =
        card.querySelector(
            ".btn-excluir-rota"
        );


    if (btnExcluir) {

        btnExcluir.addEventListener(
            "click",
            function () {

                const id =
                    btnExcluir.dataset.id;

                excluirRota(id);

            }
        );

    }


    // =====================================
    // COPIAR CÓDIGO
    // =====================================

    const btnCopiar =
        card.querySelector(
            ".btn-copiar-codigo"
        );


    if (btnCopiar) {

        btnCopiar.addEventListener(
            "click",
            function () {

                copiarCodigoAcesso(
                    btnCopiar.dataset.codigo,
                    btnCopiar
                );

            }
        );

    }


    return card;

}


// =========================================
// OBTER HORÁRIOS
// =========================================

function obterHorarios(rota) {

    let horarios =
        rota?.horarios;


    if (typeof horarios === "string") {

        try {

            horarios =
                JSON.parse(horarios);

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

    let dias =
        rota?.dias;


    if (Array.isArray(dias)) {

        return dias
            .map(
                function (dia) {

                    return texto(dia);

                }
            )
            .filter(Boolean);

    }


    if (
        typeof dias === "string" &&
        dias.trim()
    ) {

        return dias
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

function abrirFormularioRota(
    rota = null
) {

    fecharModal();


    const editando =
        rota !== null;


    /*
     * Em vez de criar um pequeno formulário
     * sobre o dashboard, criamos uma tela
     * completa de gerenciamento.
     */

    const tela =
        document.createElement("div");


    tela.id =
        "modalRota";


    tela.className =
        "modal-dashboard tela-formulario-rota";


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


    tela.innerHTML = `

        <div class="modal-conteudo formulario-tela">


            <!-- =================================
                 CABEÇALHO
            ================================== -->

            <div class="modal-cabecalho">

                <div>

                    <span class="subtitulo-formulario">
                        ${editando
                            ? "GERENCIAMENTO DE ROTAS"
                            : "NOVA ROTA"
                        }
                    </span>

                    <h2>
                        ${
                            editando
                                ? "Editar rota"
                                : "Adicionar nova rota"
                        }
                    </h2>

                    <p>
                        ${
                            editando
                                ? "Atualize os dados da rota abaixo."
                                : "Cadastre uma nova rota no Transporte Fácil."
                        }
                    </p>

                </div>


                <button
                    type="button"
                    class="btn-fechar-modal"
                    id="btnFecharModal"
                    aria-label="Voltar"
                    title="Voltar para o dashboard"
                >
                    ×
                </button>

            </div>


            <!-- =================================
                 FORMULÁRIO
            ================================== -->

            <form
                id="formRota"
                class="form-rota"
            >


                <!-- =========================
                     EMPRESA
                ========================== -->

                <div class="grupo-formulario">

                    <label for="empresa">
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


                <!-- =========================
                     E-MAIL
                ========================== -->

                <div class="grupo-formulario">

                    <label for="emailResponsavel">
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

                    <small>
                        Esse e-mail será utilizado junto
                        ao código de acesso da rota.
                    </small>

                </div>


                <!-- =========================
                     ORIGEM / DESTINO
                ========================== -->

                <div class="linha-formulario">


                    <div class="grupo-formulario">

                        <label for="origem">
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

                        <label for="destino">
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


                <!-- =========================
                     VIA
                ========================== -->

                <div class="grupo-formulario">

                    <label for="via">
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


                <!-- =========================
                     TIPO
                ========================== -->

                <div class="grupo-formulario">

                    <label for="tipo">
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


                <!-- =========================
                     DIAS
                ========================== -->

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


                <!-- =========================
                     HORÁRIOS
                ========================== -->

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


                <!-- =========================
                     INFORMAÇÕES
                ========================== -->

                <div class="grupo-formulario">

                    <label for="informacoes">
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


                <!-- =========================
                     MENSAGEM
                ========================== -->

                <div
                    id="mensagemFormulario"
                    class="mensagem-formulario"
                    role="alert"
                >
                </div>


                <!-- =========================
                     AÇÕES
                ========================== -->

                <div class="acoes-formulario">

                    <button
                        type="button"
                        id="btnCancelarFormulario"
                        class="btn-cancelar"
                    >
                        Voltar
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
        tela
    );


    /*
     * Impede o dashboard de continuar
     * rolando atrás da tela do formulário.
     */

    document.body.classList.add(
        "formulario-aberto"
    );


    // =====================================
    // CRIAR HORÁRIOS
    // =====================================

    horarios.forEach(
        function (horario) {

            adicionarCampoHorario(
                horario.saida,
                horario.chegada
            );

        }
    );


    // =====================================
    // ADICIONAR HORÁRIO
    // =====================================

    const btnAdicionarHorario =
        document.getElementById(
            "btnAdicionarHorario"
        );


    if (btnAdicionarHorario) {

        btnAdicionarHorario.addEventListener(
            "click",
            function () {

                adicionarCampoHorario(
                    "",
                    ""
                );

            }
        );

    }


    // =====================================
    // FECHAR
    // =====================================

    const btnFecharModal =
        document.getElementById(
            "btnFecharModal"
        );


    if (btnFecharModal) {

        btnFecharModal.addEventListener(
            "click",
            fecharModal
        );

    }


    const btnCancelarFormulario =
        document.getElementById(
            "btnCancelarFormulario"
        );


    if (btnCancelarFormulario) {

        btnCancelarFormulario.addEventListener(
            "click",
            fecharModal
        );

    }


    // =====================================
    // CLICAR FORA
    // =====================================

    tela.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target === tela
            ) {

                fecharModal();

            }

        }
    );


    // =====================================
    // ESC
    // =====================================

    document.addEventListener(
        "keydown",
        tratarTeclaEscape
    );


    // =====================================
    // FORMULÁRIO
    // =====================================

    const form =
        document.getElementById(
            "formRota"
        );


    if (form) {

        form.addEventListener(
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


    // =====================================
    // IR PARA O TOPO DA TELA
    // =====================================

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// =========================================
// TECLA ESC
// =========================================

function tratarTeclaEscape(evento) {

    if (
        evento.key === "Escape"
    ) {

        fecharModal();

    }

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
                value="${escaparAtributo(
                    saida
                )}"
            >

        </div>


        <div class="campo-horario">

            <label>
                Chegada
            </label>

            <input
                type="time"
                class="input-chegada"
                value="${escaparAtributo(
                    chegada
                )}"
            >

        </div>


        <button
            type="button"
            class="btn-remover-horario"
            title="Remover horário"
            aria-label="Remover horário"
        >
            ×
        </button>

    `;


    const btnRemover =
        linha.querySelector(
            ".btn-remover-horario"
        );


    if (btnRemover) {

        btnRemover.addEventListener(
            "click",
            function () {

                const quantidade =
                    lista.querySelectorAll(
                        ".linha-horario"
                    ).length;


                if (quantidade <= 1) {

                    linha
                        .querySelector(
                            ".input-saida"
                        )
                        .value = "";

                    linha
                        .querySelector(
                            ".input-chegada"
                        )
                        .value = "";

                    return;

                }


                linha.remove();

            }
        );

    }


    lista.appendChild(
        linha
    );

}


// =========================================
// COLETAR HORÁRIOS
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
                    .trim() || "";


            const chegada =
                linha
                    .querySelector(
                        ".input-chegada"
                    )
                    ?.value
                    .trim() || "";


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
// COLETAR DADOS
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
                .getElementById("empresa")
                ?.value
                .trim() || "",

        emailResponsavel:
            document
                .getElementById("emailResponsavel")
                ?.value
                .trim() || "",

        origem:
            document
                .getElementById("origem")
                ?.value
                .trim() || "",

        destino:
            document
                .getElementById("destino")
                ?.value
                .trim() || "",

        via:
            document
                .getElementById("via")
                ?.value
                .trim() || "",

        tipo:
            document
                .getElementById("tipo")
                ?.value
                .trim() || "",

        dias:
            dias,

        horarios:
            horarios,

        informacoes:
            document
                .getElementById("informacoes")
                ?.value
                .trim() || ""

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
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
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
                    ? resultado.camposPendentes
                        .map(
                            function (campo) {

                                return escaparHTML(
                                    campo
                                );

                            }
                        )
                        .join("<br>")
                    : resultado.mensagem ||
                      "Erro ao cadastrar rota.";


            throw new Error(
                mensagem
            );

        }


        let mensagemSucesso = `

            <strong>
                Rota cadastrada com sucesso!
            </strong>

        `;


        if (
            resultado.codigoAcesso
        ) {

            mensagemSucesso += `

                <div class="codigo-acesso-sucesso">

                    <span>
                        Código de acesso:
                    </span>

                    <strong>
                        ${escaparHTML(
                            resultado.codigoAcesso
                        )}
                    </strong>

                </div>

                <small>
                    Guarde esse código.
                    Ele será usado pelo responsável
                    junto com o e-mail cadastrado.
                </small>

            `;

        }


        mostrarMensagemFormulario(
            mensagemSucesso,
            "sucesso"
        );


        if (botao) {

            botao.textContent =
                "Cadastrado!";

        }


        setTimeout(
            function () {

                fecharModal();

                carregarRotas();

            },
            2200
        );

    }

    catch (erro) {

        console.error(
            "Erro ao cadastrar rota:",
            erro
        );


        mostrarMensagemFormulario(
            escaparHTML(
                erro.message ||
                "Erro ao cadastrar rota."
            ),
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

    if (!id) {

        alert(
            "ID da rota não informado."
        );

        return;

    }


    try {

        const resposta =
            await fetch(
                `${API_URL}/rotas/${encodeURIComponent(id)}`
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Não foi possível buscar a rota."
            );

        }


        if (!dados.rota) {

            throw new Error(
                "A API não retornou os dados da rota."
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
                `${API_URL}/rotas/${encodeURIComponent(id)}`,
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
                    ? resultado.camposPendentes
                        .map(
                            function (campo) {

                                return escaparHTML(
                                    campo
                                );

                            }
                        )
                        .join("<br>")
                    : resultado.mensagem ||
                      "Erro ao atualizar rota.";


            throw new Error(
                mensagem
            );

        }


        mostrarMensagemFormulario(
            escaparHTML(
                resultado.mensagem ||
                "Rota atualizada com sucesso!"
            ),
            "sucesso"
        );


        if (botao) {

            botao.textContent =
                "Salvo!";

        }


        setTimeout(
            function () {

                fecharModal();

                carregarRotas();

            },
            1400
        );

    }

    catch (erro) {

        console.error(
            "Erro ao editar rota:",
            erro
        );


        mostrarMensagemFormulario(
            escaparHTML(
                erro.message ||
                "Erro ao atualizar rota."
            ),
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

    if (!id) {

        alert(
            "ID da rota não informado."
        );

        return;

    }


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
                `${API_URL}/rotas/${encodeURIComponent(id)}`,
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

    const lista =
        document.querySelector(
            ".lista-rotas"
        );


    if (lista) {

        lista.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    alert(
        "Os horários são gerenciados dentro de cada rota.\n\nClique em \"Editar\" em uma rota para adicionar, alterar ou remover horários."
    );

}


// =========================================
// COPIAR CÓDIGO DE ACESSO
// =========================================

async function copiarCodigoAcesso(
    codigo,
    botao
) {

    if (!codigo) {
        return;
    }


    try {

        await navigator.clipboard.writeText(
            codigo
        );


        const textoOriginal =
            botao.textContent;


        botao.textContent =
            "Copiado!";


        setTimeout(
            function () {

                botao.textContent =
                    textoOriginal;

            },
            1500
        );

    }

    catch (erro) {

        console.error(
            "Erro ao copiar código:",
            erro
        );


        const campo =
            document.createElement("input");


        campo.value =
            codigo;


        document.body.appendChild(
            campo
        );


        campo.select();


        try {

            document.execCommand(
                "copy"
            );


            botao.textContent =
                "Copiado!";


            setTimeout(
                function () {

                    botao.textContent =
                        "Copiar";

                },
                1500
            );

        }

        catch (erroCopia) {

            alert(
                `Código de acesso: ${codigo}`
            );

        }


        campo.remove();

    }

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


    elemento.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


// =========================================
// FECHAR TELA DO FORMULÁRIO
// =========================================

function fecharModal() {

    const modal =
        document.getElementById(
            "modalRota"
        );


    if (modal) {

        modal.remove();

    }


    document.body.classList.remove(
        "formulario-aberto"
    );


    document.removeEventListener(
        "keydown",
        tratarTeclaEscape
    );

}


// =========================================
// TEXTO
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