// =========================================
// DETALHES DA ROTA - TRANSPORTE FÁCIL
// =========================================


// =========================================
// ENDEREÇO DA API
// =========================================

const API_URL =
    "https://transporte-facil-api.onrender.com";


// =========================================
// ELEMENTOS DA TELA
// =========================================

const btnVoltar =
    document.getElementById("btnVoltar");


const btnVoltarErro =
    document.getElementById("btnVoltarErro");


const btnVoltarPrincipal =
    document.getElementById("btnVoltarPrincipal");


const carregando =
    document.getElementById("carregando");


const erro =
    document.getElementById("erro");


const mensagemErro =
    document.getElementById("mensagemErro");


const conteudoRota =
    document.getElementById("conteudoRota");


const iconeTransporte =
    document.getElementById("iconeTransporte");


const nomeRota =
    document.getElementById("nomeRota");


const origem =
    document.getElementById("origem");


const destino =
    document.getElementById("destino");


const via =
    document.getElementById("via");


const listaHorarios =
    document.getElementById("listaHorarios");


const dias =
    document.getElementById("dias");


const tipoTransporte =
    document.getElementById("tipoTransporte");


const informacoes =
    document.getElementById("informacoes");


// =========================================
// VOLTAR PARA A TELA PRINCIPAL
// =========================================

function voltarParaRotas() {

    window.location.href =
        "tela_principal.html";

}


if (btnVoltar) {

    btnVoltar.addEventListener(
        "click",
        voltarParaRotas
    );

}


if (btnVoltarErro) {

    btnVoltarErro.addEventListener(
        "click",
        voltarParaRotas
    );

}


if (btnVoltarPrincipal) {

    btnVoltarPrincipal.addEventListener(
        "click",
        voltarParaRotas
    );

}


// =========================================
// FORMATAR DIAS
// =========================================

function formatarDias(
    diasRecebidos
) {

    if (!diasRecebidos) {

        return "Não informado";

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


    if (Array.isArray(diasRecebidos)) {

        lista =
            diasRecebidos;

    }

    else {

        lista =
            String(
                diasRecebidos
            ).split(",");

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
                    String(dia).trim()
                );

            }
        )

        .join(", ");

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
// MOSTRAR ERRO
// =========================================

function mostrarErro(
    mensagem
) {

    if (carregando) {

        carregando.style.display =
            "none";

    }


    if (conteudoRota) {

        conteudoRota.style.display =
            "none";

    }


    if (mensagemErro) {

        mensagemErro.textContent =
            mensagem;

    }


    if (erro) {

        erro.style.display =
            "block";

    }

}


// =========================================
// MOSTRAR HORÁRIOS
// =========================================

function mostrarHorarios(
    horarios
) {

    if (!listaHorarios) {

        return;

    }


    // =====================================
    // LIMPAR LISTA
    // =====================================

    listaHorarios.innerHTML =
        "";


    // =====================================
    // VERIFICAR HORÁRIOS
    // =====================================

    if (
        !Array.isArray(horarios) ||
        horarios.length === 0
    ) {

        const mensagem =
            document.createElement(
                "p"
            );


        mensagem.textContent =
            "Nenhum horário informado.";


        mensagem.className =
            "sem-horarios";


        listaHorarios.appendChild(
            mensagem
        );


        return;

    }


    // =====================================
    // CRIAR CADA HORÁRIO
    // =====================================

    horarios.forEach(
        function (
            horario,
            indice
        ) {

            // =================================
            // ITEM
            // =================================

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "item-horario";


            // =================================
            // TÍTULO
            // =================================

            const titulo =
                document.createElement(
                    "strong"
                );


            titulo.textContent =
                "Horário " +
                (indice + 1);


            // =================================
            // VALORES
            // =================================

            const valores =
                document.createElement(
                    "div"
                );


            valores.className =
                "valores-horario";


            // =================================
            // SAÍDA
            // =================================

            const saida =
                document.createElement(
                    "span"
                );


            saida.textContent =
                "🚌 " +
                (
                    horario?.saida ||
                    "-"
                );


            // =================================
            // SETA
            // =================================

            const seta =
                document.createElement(
                    "span"
                );


            seta.textContent =
                "→";


            // =================================
            // CHEGADA
            // =================================

            const chegada =
                document.createElement(
                    "span"
                );


            chegada.textContent =
                "🏁 " +
                (
                    horario?.chegada ||
                    "-"
                );


            // =================================
            // MONTAR VALORES
            // =================================

            valores.appendChild(
                saida
            );


            valores.appendChild(
                seta
            );


            valores.appendChild(
                chegada
            );


            // =================================
            // MONTAR ITEM
            // =================================

            item.appendChild(
                titulo
            );


            item.appendChild(
                valores
            );


            // =================================
            // ADICIONAR À LISTA
            // =================================

            listaHorarios.appendChild(
                item
            );

        }
    );

}


// =========================================
// MOSTRAR ROTA
// =========================================

function mostrarRota(
    rota
) {

    if (carregando) {

        carregando.style.display =
            "none";

    }


    if (erro) {

        erro.style.display =
            "none";

    }


    if (conteudoRota) {

        conteudoRota.style.display =
            "block";

    }


    // =================================
    // NOME
    // =================================

    if (nomeRota) {

        nomeRota.textContent =
            rota.nome ||
            rota.empresa ||
            "Transporte";

    }


    // =================================
    // ORIGEM
    // =================================

    if (origem) {

        origem.textContent =
            rota.origem ||
            "Não informado";

    }


    // =================================
    // DESTINO
    // =================================

    if (destino) {

        destino.textContent =
            rota.destino ||
            "Não informado";

    }


    // =================================
    // VIA
    // =================================

    if (via) {

        via.textContent =
            rota.via ||
            "Não informado";

    }


    // =================================
    // HORÁRIOS
    // =================================

    mostrarHorarios(
        rota.horarios
    );


    // =================================
    // DIAS
    // =================================

    if (dias) {

        dias.textContent =
            formatarDias(
                rota.dias
            );

    }


    // =================================
    // TIPO
    // =================================

    const tipo =
        formatarTipo(
            rota.tipo
        );


    if (tipoTransporte) {

        tipoTransporte.textContent =
            tipo;

    }


    // =================================
    // ÍCONE
    // =================================

    if (iconeTransporte) {

        iconeTransporte.textContent =
            rota.tipo === "van"
                ? "🚐"
                : "🚌";

    }


    // =================================
    // INFORMAÇÕES ADICIONAIS
    // =================================

    if (informacoes) {

        informacoes.textContent =
            rota.informacoes ||
            "Nenhuma informação adicional.";

    }

}


// =========================================
// PEGAR ID DA ROTA NA URL
// =========================================

function obterIdDaRota() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    return parametros.get(
        "id"
    );

}


// =========================================
// BUSCAR ROTA NA API
// =========================================

async function carregarRota() {

    const id =
        obterIdDaRota();


    console.log(
        "ID da rota recebido:",
        id
    );


    // =================================
    // VERIFICAR ID
    // =================================

    if (!id) {

        mostrarErro(
            "Nenhuma rota foi selecionada."
        );

        return;

    }


    try {

        // =================================
        // BUSCAR ROTA
        // =================================

        const resposta =
            await fetch(

                API_URL +
                "/rotas/" +
                encodeURIComponent(
                    id
                )

            );


        // =================================
        // VERIFICAR RESPOSTA
        // =================================

        if (!resposta.ok) {

            throw new Error(
                "A API não encontrou essa rota."
            );

        }


        // =================================
        // CONVERTER RESPOSTA
        // =================================

        const dados =
            await resposta.json();


        console.log(
            "Rota recebida da API:",
            dados
        );


        // =================================
        // ACEITAR DIFERENTES FORMATOS
        // =================================

        const rota =
            dados.rota ||
            dados;


        if (!rota) {

            throw new Error(
                "A rota não foi encontrada."
            );

        }


        // =================================
        // MOSTRAR ROTA
        // =================================

        mostrarRota(
            rota
        );

    }


    catch (erroApi) {

        console.error(
            "Erro ao carregar rota:",
            erroApi
        );


        mostrarErro(
            "Não foi possível carregar as informações desta rota."
        );

    }

}


// =========================================
// INICIAR
// =========================================

carregarRota();