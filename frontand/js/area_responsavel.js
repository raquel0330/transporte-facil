// =========================================
// ÁREA DO RESPONSÁVEL
// TRANSPORTE FÁCIL
// =========================================


// =========================================
// API
// =========================================

const API_URL =
    "https://transporte-facil-api.onrender.com";


// =========================================
// ELEMENTOS
// =========================================

const btnVoltar =
    document.getElementById("btnVoltar");

const btnSair =
    document.getElementById("btnSair");

const btnEditar =
    document.getElementById("btnEditar");

const btnExcluir =
    document.getElementById("btnExcluir");

const mensagem =
    document.getElementById("mensagem");

const visualizacaoRota =
    document.getElementById("visualizacaoRota");

const formularioEdicao =
    document.getElementById("formularioEdicao");

const formEditarRota =
    document.getElementById("formEditarRota");

const btnCancelarEdicao =
    document.getElementById("btnCancelarEdicao");

const listaHorariosEdicao =
    document.getElementById(
        "listaHorariosEdicao"
    );

const btnAdicionarHorario =
    document.getElementById(
        "btnAdicionarHorario"
    );


// =========================================
// ELEMENTOS DA ROTA
// =========================================

const rotaEmpresa =
    document.getElementById("rotaEmpresa");

const rotaOrigem =
    document.getElementById("rotaOrigem");

const rotaDestino =
    document.getElementById("rotaDestino");

const rotaVia =
    document.getElementById("rotaVia");

const rotaTipo =
    document.getElementById("rotaTipo");

const rotaSaida =
    document.getElementById("rotaSaida");

const rotaChegada =
    document.getElementById("rotaChegada");

const rotaDias =
    document.getElementById("rotaDias");

const rotaInformacoes =
    document.getElementById("rotaInformacoes");

const codigoRota =
    document.getElementById("codigoRota");

const blocoInformacoes =
    document.getElementById("blocoInformacoes");

const blocoHorariosExtras =
    document.getElementById(
        "blocoHorariosExtras"
    );

const listaHorariosExibicao =
    document.getElementById(
        "listaHorariosExibicao"
    );


// =========================================
// ELEMENTOS DO FORMULÁRIO
// =========================================

const editarEmpresa =
    document.getElementById("editarEmpresa");

const editarEmail =
    document.getElementById("editarEmail");

const editarOrigem =
    document.getElementById("editarOrigem");

const editarDestino =
    document.getElementById("editarDestino");

const editarVia =
    document.getElementById("editarVia");

const editarTipo =
    document.getElementById("editarTipo");

const editarInformacoes =
    document.getElementById("editarInformacoes");


// =========================================
// RECUPERAR ROTA
// =========================================

const rotaSalva =
    sessionStorage.getItem(
        "rotaResponsavel"
    );


// =========================================
// VERIFICAR ACESSO
// =========================================

if (!rotaSalva) {

    window.location.href =
        "acesso_responsavel.html";

}


// =========================================
// CONVERTER DADOS
// =========================================

let rota = null;

try {

    rota =
        JSON.parse(
            rotaSalva
        );

}

catch (erro) {

    console.error(
        "Erro ao carregar a rota:",
        erro
    );

    sessionStorage.removeItem(
        "rotaResponsavel"
    );

    window.location.href =
        "acesso_responsavel.html";

}


// =========================================
// FORMATAR TIPO
// =========================================

function formatarTipo(tipo) {

    if (
        String(tipo).toLowerCase() ===
        "onibus"
    ) {

        return "🚌 Ônibus";

    }


    if (
        String(tipo).toLowerCase() ===
        "van"
    ) {

        return "🚐 Van";

    }


    return tipo || "-";

}


// =========================================
// FORMATAR DIAS
// =========================================

function formatarDias(dias) {

    if (!dias) {

        return "-";

    }


    const nomesDias = {

        segunda:
            "Segunda",

        terca:
            "Terça",

        terça:
            "Terça",

        quarta:
            "Quarta",

        quinta:
            "Quinta",

        sexta:
            "Sexta",

        sabado:
            "Sábado",

        sábado:
            "Sábado",

        domingo:
            "Domingo"

    };


    let lista;


    if (Array.isArray(dias)) {

        lista =
            dias;

    }

    else {

        lista =
            String(dias)
                .split(",");

    }


    return lista

        .map(
            function (dia) {

                const valor =
                    String(dia)
                        .trim()
                        .toLowerCase();

                return (
                    nomesDias[valor] ||
                    valor
                );

            }
        )

        .join(", ");

}


// =========================================
// OBTER HORÁRIOS
// =========================================

function obterHorariosDaRota() {

    if (!rota) {

        return [];

    }


    let horarios =
        rota.horarios;


    // =====================================
    // ARRAY
    // =====================================

    if (Array.isArray(horarios)) {

        return horarios;

    }


    // =====================================
    // JSON EM STRING
    // =====================================

    if (
        typeof horarios === "string"
    ) {

        try {

            const convertido =
                JSON.parse(
                    horarios
                );


            if (
                Array.isArray(
                    convertido
                )
            ) {

                return convertido;

            }

        }

        catch (erro) {

            console.error(
                "Erro ao interpretar horários:",
                erro
            );

        }

    }


    return [];

}


// =========================================
// MOSTRAR MENSAGEM
// =========================================

function mostrarMensagem(
    textoMensagem,
    tipo
) {

    if (!mensagem) {

        return;

    }


    mensagem.textContent =
        textoMensagem;


    mensagem.className =
        "mensagem";


    if (tipo) {

        mensagem.classList.add(
            tipo
        );

    }

}


// =========================================
// LIMPAR MENSAGEM
// =========================================

function limparMensagem() {

    if (!mensagem) {

        return;

    }


    mensagem.textContent =
        "";

    mensagem.className =
        "mensagem";

}


// =========================================
// CRIAR CAMPO DE HORÁRIO
// =========================================

function criarCampoHorario(
    saida = "",
    chegada = "",
    numero = 1
) {

    if (!listaHorariosEdicao) {

        return;

    }


    const bloco =
        document.createElement(
            "div"
        );


    bloco.className =
        "bloco-horario-edicao";


    bloco.dataset.numero =
        numero;


    // =====================================
    // CABEÇALHO
    // =====================================

    const cabecalho =
        document.createElement(
            "div"
        );


    cabecalho.className =
        "cabecalho-horario-edicao";


    const titulo =
        document.createElement(
            "strong"
        );


    titulo.textContent =
        "Horário " + numero;


    cabecalho.appendChild(
        titulo
    );


    // =====================================
    // BOTÃO REMOVER
    // =====================================

    if (numero > 1) {

        const btnRemover =
            document.createElement(
                "button"
            );


        btnRemover.type =
            "button";


        btnRemover.className =
            "btn-remover-horario";


        btnRemover.textContent =
            "🗑️ Remover";


        btnRemover.addEventListener(
            "click",
            function () {

                bloco.remove();

                renumerarHorarios();

            }
        );


        cabecalho.appendChild(
            btnRemover
        );

    }


    bloco.appendChild(
        cabecalho
    );


    // =====================================
    // LINHA
    // =====================================

    const linha =
        document.createElement(
            "div"
        );


    linha.className =
        "linha-edicao";


    // =====================================
    // SAÍDA
    // =====================================

    const grupoSaida =
        document.createElement(
            "div"
        );


    grupoSaida.className =
        "grupo-edicao";


    const labelSaida =
        document.createElement(
            "label"
        );


    labelSaida.textContent =
        "Horário de saída";


    const inputSaida =
        document.createElement(
            "input"
        );


    inputSaida.type =
        "time";


    inputSaida.className =
        "campo-horario-saida";


    inputSaida.value =
        saida || "";


    grupoSaida.appendChild(
        labelSaida
    );


    grupoSaida.appendChild(
        inputSaida
    );


    // =====================================
    // CHEGADA
    // =====================================

    const grupoChegada =
        document.createElement(
            "div"
        );


    grupoChegada.className =
        "grupo-edicao";


    const labelChegada =
        document.createElement(
            "label"
        );


    labelChegada.textContent =
        "Horário de chegada";


    const inputChegada =
        document.createElement(
            "input"
        );


    inputChegada.type =
        "time";


    inputChegada.className =
        "campo-horario-chegada";


    inputChegada.value =
        chegada || "";


    grupoChegada.appendChild(
        labelChegada
    );


    grupoChegada.appendChild(
        inputChegada
    );


    linha.appendChild(
        grupoSaida
    );


    linha.appendChild(
        grupoChegada
    );


    bloco.appendChild(
        linha
    );


    listaHorariosEdicao.appendChild(
        bloco
    );

}


// =========================================
// RENUMERAR HORÁRIOS
// =========================================

function renumerarHorarios() {

    if (!listaHorariosEdicao) {

        return;

    }


    const blocos =
        listaHorariosEdicao.querySelectorAll(
            ".bloco-horario-edicao"
        );


    blocos.forEach(
        function (bloco, indice) {

            const numero =
                indice + 1;


            bloco.dataset.numero =
                numero;


            const titulo =
                bloco.querySelector(
                    ".cabecalho-horario-edicao strong"
                );


            if (titulo) {

                titulo.textContent =
                    "Horário " + numero;

            }


            const cabecalho =
                bloco.querySelector(
                    ".cabecalho-horario-edicao"
                );


            if (!cabecalho) {

                return;

            }


            let botaoRemover =
                cabecalho.querySelector(
                    ".btn-remover-horario"
                );


            if (numero === 1) {

                if (botaoRemover) {

                    botaoRemover.remove();

                }

                return;

            }


            if (!botaoRemover) {

                botaoRemover =
                    document.createElement(
                        "button"
                    );


                botaoRemover.type =
                    "button";


                botaoRemover.className =
                    "btn-remover-horario";


                botaoRemover.textContent =
                    "🗑️ Remover";


                botaoRemover.addEventListener(
                    "click",
                    function () {

                        bloco.remove();

                        renumerarHorarios();

                    }
                );


                cabecalho.appendChild(
                    botaoRemover
                );

            }

        }
    );

}


// =========================================
// PREENCHER HORÁRIOS DA EDIÇÃO
// =========================================

function preencherHorariosEdicao() {

    if (!listaHorariosEdicao) {

        return;

    }


    listaHorariosEdicao.innerHTML =
        "";


    const horarios =
        obterHorariosDaRota();


    // =====================================
    // SE NÃO EXISTIR HORÁRIO
    // =====================================

    if (horarios.length === 0) {

        criarCampoHorario(
            "",
            "",
            1
        );

        return;

    }


    // =====================================
    // CRIAR TODOS OS HORÁRIOS
    // =====================================

    horarios.forEach(
        function (horario, indice) {

            criarCampoHorario(

                horario?.saida ||
                    "",

                horario?.chegada ||
                    "",

                indice + 1

            );

        }
    );

}


// =========================================
// COLETAR HORÁRIOS DA EDIÇÃO
// =========================================

function coletarHorariosEdicao() {

    if (!listaHorariosEdicao) {

        return [];

    }


    const blocos =
        listaHorariosEdicao.querySelectorAll(
            ".bloco-horario-edicao"
        );


    const horarios = [];


    blocos.forEach(
        function (bloco, indice) {

            const saida =
                bloco.querySelector(
                    ".campo-horario-saida"
                )?.value || "";


            const chegada =
                bloco.querySelector(
                    ".campo-horario-chegada"
                )?.value || "";


            const numero =
                indice + 1;


            // =================================
            // IGNORAR HORÁRIO COMPLETAMENTE VAZIO
            // =================================

            if (
                !saida &&
                !chegada
            ) {

                return;

            }


            // =================================
            // VALIDAR PAR
            // =================================

            if (
                saida &&
                !chegada
            ) {

                throw new Error(
                    `Horário ${numero}: informe o horário de chegada.`
                );

            }


            if (
                !saida &&
                chegada
            ) {

                throw new Error(
                    `Horário ${numero}: informe o horário de saída.`
                );

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
// ESCONDER HORÁRIO SEPARADO
// =========================================
//
// Na visualização da rota não vamos mais
// mostrar "Horário de saída" e
// "Horário de chegada" separadamente.
//
// Eles continuam existindo no HTML e
// continuam funcionando normalmente
// dentro da edição.
//
// =========================================

function esconderHorariosSeparados() {

    const elementos =
        [
            rotaSaida,
            rotaChegada
        ];


    elementos.forEach(
        function (elemento) {

            if (!elemento) {

                return;

            }


            const informacao =
                elemento.closest(
                    ".informacao"
                );


            if (informacao) {

                informacao.style.display =
                    "none";

            }

        }
    );

}


// =========================================
// PREENCHER TELA
// =========================================

function preencherTela() {

    if (!rota) {

        return;

    }


    // =====================================
    // EMPRESA
    // =====================================

    if (rotaEmpresa) {

        rotaEmpresa.textContent =
            rota.nome || "-";

    }


    // =====================================
    // ORIGEM
    // =====================================

    if (rotaOrigem) {

        rotaOrigem.textContent =
            rota.origem || "-";

    }


    // =====================================
    // DESTINO
    // =====================================

    if (rotaDestino) {

        rotaDestino.textContent =
            rota.destino || "-";

    }


    // =====================================
    // VIA
    // =====================================

    if (rotaVia) {

        rotaVia.textContent =
            rota.via || "-";

    }


    // =====================================
    // TIPO
    // =====================================

    if (rotaTipo) {

        rotaTipo.textContent =
            formatarTipo(
                rota.tipo
            );

    }


    // =====================================
    // DIAS
    // =====================================

    if (rotaDias) {

        rotaDias.textContent =
            formatarDias(
                rota.dias
            );

    }


    // =====================================
    // HORÁRIOS
    // =====================================

    const horarios =
        obterHorariosDaRota();


    // =====================================
    // ESCONDER HORÁRIOS SEPARADOS
    // =====================================

    esconderHorariosSeparados();


    // =====================================
    // MOSTRAR TODOS OS HORÁRIOS
    // =====================================

    if (
        blocoHorariosExtras &&
        listaHorariosExibicao
    ) {

        listaHorariosExibicao.innerHTML =
            "";


        if (horarios.length > 0) {

            horarios.forEach(
                function (horario, indice) {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "horario-exibicao";


                    const titulo =
                        document.createElement(
                            "strong"
                        );


                    titulo.textContent =
                        "Horário " +
                        (indice + 1);


                    const valor =
                        document.createElement(
                            "span"
                        );


                    valor.textContent =
                        "🕐 " +
                        (horario?.saida || "-") +
                        " → " +
                        (horario?.chegada || "-");


                    item.appendChild(
                        titulo
                    );


                    item.appendChild(
                        valor
                    );


                    listaHorariosExibicao.appendChild(
                        item
                    );

                }
            );


            blocoHorariosExtras.hidden =
                false;

        }

        else {

            blocoHorariosExtras.hidden =
                true;

        }

    }


    // =====================================
    // CÓDIGO DE ACESSO
    // =====================================

    if (codigoRota) {

        codigoRota.textContent =
            rota.codigo_acesso ||
            rota.codigoAcesso ||
            "-";

    }


    // =====================================
    // INFORMAÇÕES ADICIONAIS
    // =====================================

    if (
        rota.informacoes &&
        String(
            rota.informacoes
        ).trim() !== ""
    ) {

        if (rotaInformacoes) {

            rotaInformacoes.textContent =
                rota.informacoes;

        }


        if (blocoInformacoes) {

            blocoInformacoes.hidden =
                false;

        }

    }

    else {

        if (blocoInformacoes) {

            blocoInformacoes.hidden =
                true;

        }

    }

}


// =========================================
// PREENCHER FORMULÁRIO
// =========================================

function preencherFormulario() {

    if (!rota) {

        return;

    }


    // =====================================
    // EMPRESA
    // =====================================

    if (editarEmpresa) {

        editarEmpresa.value =
            rota.nome || "";

    }


    // =====================================
    // E-MAIL
    // =====================================

    if (editarEmail) {

        editarEmail.value =
            rota.email_responsavel ||
            rota.emailResponsavel ||
            "";

    }


    // =====================================
    // ORIGEM
    // =====================================

    if (editarOrigem) {

        editarOrigem.value =
            rota.origem || "";

    }


    // =====================================
    // DESTINO
    // =====================================

    if (editarDestino) {

        editarDestino.value =
            rota.destino || "";

    }


    // =====================================
    // VIA
    // =====================================

    if (editarVia) {

        editarVia.value =
            rota.via || "";

    }


    // =====================================
    // TIPO
    // =====================================

    if (editarTipo) {

        editarTipo.value =
            rota.tipo || "";

    }


    // =====================================
    // HORÁRIOS
    // =====================================

    preencherHorariosEdicao();


    // =====================================
    // INFORMAÇÕES
    // =====================================

    if (editarInformacoes) {

        editarInformacoes.value =
            rota.informacoes || "";

    }


    // =====================================
    // DIAS
    // =====================================

    const diasDaRota =
        Array.isArray(
            rota.dias
        )

            ? rota.dias

            : String(
                rota.dias || ""
            )
                .split(",");


    const diasNormalizados =
        diasDaRota.map(
            function (dia) {

                return String(dia)
                    .trim()
                    .toLowerCase();

            }
        );


    const checkboxes =
        document.querySelectorAll(
            'input[name="dias"]'
        );


    checkboxes.forEach(
        function (checkbox) {

            checkbox.checked =
                diasNormalizados.includes(
                    checkbox.value
                        .trim()
                        .toLowerCase()
                );

        }
    );

}


// =========================================
// ABRIR EDIÇÃO
// =========================================

function abrirEdicao() {

    preencherFormulario();


    if (visualizacaoRota) {

        visualizacaoRota.hidden =
            true;

    }


    if (formularioEdicao) {

        formularioEdicao.hidden =
            false;

    }


    limparMensagem();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =========================================
// FECHAR EDIÇÃO
// =========================================

function fecharEdicao() {

    if (formularioEdicao) {

        formularioEdicao.hidden =
            true;

    }


    if (visualizacaoRota) {

        visualizacaoRota.hidden =
            false;

    }


    limparMensagem();

}


// =========================================
// ADICIONAR HORÁRIO
// =========================================

if (btnAdicionarHorario) {

    btnAdicionarHorario.addEventListener(
        "click",
        function () {

            const quantidade =
                listaHorariosEdicao
                    ?.querySelectorAll(
                        ".bloco-horario-edicao"
                    )
                    .length || 0;


            criarCampoHorario(
                "",
                "",
                quantidade + 1
            );


            renumerarHorarios();

        }
    );

}


// =========================================
// BOTÃO VOLTAR
// =========================================

if (btnVoltar) {

    btnVoltar.addEventListener(
        "click",
        function () {

            window.location.href =
                "tela_principal.html";

        }
    );

}


// =========================================
// BOTÃO SAIR
// =========================================

if (btnSair) {

    btnSair.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "rotaResponsavel"
            );


            window.location.href =
                "acesso_responsavel.html";

        }
    );

}


// =========================================
// BOTÃO EDITAR
// =========================================

if (btnEditar) {

    btnEditar.addEventListener(
        "click",
        function () {

            abrirEdicao();

        }
    );

}


// =========================================
// CANCELAR EDIÇÃO
// =========================================

if (btnCancelarEdicao) {

    btnCancelarEdicao.addEventListener(
        "click",
        function () {

            fecharEdicao();

        }
    );

}


// =========================================
// SALVAR EDIÇÃO
// =========================================

if (formEditarRota) {

    formEditarRota.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();


            if (
                !rota ||
                !rota.id
            ) {

                mostrarMensagem(
                    "Não foi possível identificar a rota.",
                    "erro"
                );

                return;

            }


            // =================================
            // DIAS
            // =================================

            const checkboxes =
                document.querySelectorAll(
                    'input[name="dias"]:checked'
                );


            const dias =
                Array.from(
                    checkboxes
                )
                .map(
                    function (checkbox) {

                        return checkbox.value;

                    }
                );


            if (
                dias.length === 0
            ) {

                mostrarMensagem(
                    "Selecione pelo menos um dia de funcionamento.",
                    "erro"
                );

                return;

            }


            // =================================
            // HORÁRIOS
            // =================================

            let horarios;


            try {

                horarios =
                    coletarHorariosEdicao();

            }

            catch (erro) {

                mostrarMensagem(
                    erro.message,
                    "erro"
                );

                return;

            }


            if (
                horarios.length === 0
            ) {

                mostrarMensagem(
                    "Informe pelo menos um horário.",
                    "erro"
                );

                return;

            }


            // =================================
            // BOTÃO
            // =================================

            const botaoSalvar =
                document.getElementById(
                    "btnSalvarEdicao"
                );


            if (botaoSalvar) {

                botaoSalvar.disabled =
                    true;

                botaoSalvar.textContent =
                    "Salvando...";

            }


            try {

                // =================================
                // DADOS
                // =================================

                const dados = {

                    empresa:
                        editarEmpresa.value
                            .trim(),

                    emailResponsavel:
                        editarEmail.value
                            .trim()
                            .toLowerCase(),

                    origem:
                        editarOrigem.value
                            .trim(),

                    destino:
                        editarDestino.value
                            .trim(),

                    via:
                        editarVia.value
                            .trim(),

                    tipo:
                        editarTipo.value,

                    dias:
                        dias,

                    horarios:
                        horarios,

                    informacoes:
                        editarInformacoes.value
                            .trim()

                };


                console.log(
                    "Dados enviados para atualização:",
                    dados
                );


                // =================================
                // ENVIAR
                // =================================

                const resposta =
                    await fetch(

                        API_URL +
                        "/rotas/" +
                        encodeURIComponent(
                            rota.id
                        ),

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


                // =================================
                // RESPOSTA
                // =================================

                const resultado =
                    await resposta.json();


                if (!resposta.ok) {

                    throw new Error(

                        resultado.mensagem ||
                        resultado.erro ||
                        "Não foi possível atualizar a rota."

                    );

                }


                // =================================
                // ATUALIZAR ROTA
                // =================================

                rota =
                    resultado.rota;


                sessionStorage.setItem(

                    "rotaResponsavel",

                    JSON.stringify(
                        rota
                    )

                );


                // =================================
                // ATUALIZAR TELA
                // =================================

                preencherTela();


                fecharEdicao();


                mostrarMensagem(

                    "Rota atualizada com sucesso!",

                    "sucesso"

                );


                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }


            catch (erro) {

                console.error(
                    "Erro ao atualizar rota:",
                    erro
                );


                mostrarMensagem(

                    erro.message ||
                    "Erro ao atualizar a rota.",

                    "erro"

                );

            }


            finally {

                if (botaoSalvar) {

                    botaoSalvar.disabled =
                        false;

                    botaoSalvar.textContent =
                        "💾 Salvar alterações";

                }

            }

        }
    );

}


// =========================================
// EXCLUIR ROTA
// =========================================

if (btnExcluir) {

    btnExcluir.addEventListener(
        "click",
        async function () {

            if (
                !rota ||
                !rota.id
            ) {

                mostrarMensagem(
                    "Não foi possível identificar a rota.",
                    "erro"
                );

                return;

            }


            // =================================
            // CONFIRMAÇÃO
            // =================================

            const confirmar =
                confirm(

                    "Tem certeza que deseja excluir esta rota?\n\n" +

                    "Essa ação não poderá ser desfeita.\n" +

                    "O acesso do responsável a esta rota também será encerrado."

                );


            if (!confirmar) {

                return;

            }


            // =================================
            // BOTÃO
            // =================================

            btnExcluir.disabled =
                true;


            btnExcluir.textContent =
                "Excluindo...";


            try {

                const resposta =
                    await fetch(

                        API_URL +
                        "/rotas/" +
                        encodeURIComponent(
                            rota.id
                        ),

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
                        resultado.erro ||
                        "Não foi possível excluir a rota."

                    );

                }


                // =================================
                // REMOVER ACESSO
                // =================================

                sessionStorage.removeItem(
                    "rotaResponsavel"
                );


                mostrarMensagem(

                    "Rota excluída com sucesso!",

                    "sucesso"

                );


                setTimeout(

                    function () {

                        window.location.href =
                            "tela_principal.html";

                    },

                    1200

                );

            }


            catch (erro) {

                console.error(
                    "Erro ao excluir rota:",
                    erro
                );


                mostrarMensagem(

                    erro.message ||
                    "Erro ao excluir a rota.",

                    "erro"

                );


                btnExcluir.disabled =
                    false;


                btnExcluir.textContent =
                    "🗑️ Excluir rota";

            }

        }
    );

}


// =========================================
// INICIAR
// =========================================

preencherTela();