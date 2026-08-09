// =========================================
// TELA PRINCIPAL - TRANSPORTE FÁCIL
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

const btnMenu =
    document.getElementById("btnMenu");

const menuDropdown =
    document.getElementById("menuDropdown");

const campoBusca =
    document.getElementById("campoBusca");

const btnLimpar =
    document.getElementById("btnLimpar");

const contadorLinhas =
    document.getElementById("contadorLinhas");

const semResultados =
    document.getElementById("semResultados");

const listaLinhas =
    document.getElementById("listaLinhas");

const itensMenu =
    document.querySelectorAll(".item-menu");

// =========================================
// DADOS DAS ROTAS
// =========================================

let rotas = [];

// =========================================
// BOTÃO VOLTAR
// =========================================

if (btnVoltar) {

    btnVoltar.addEventListener(
        "click",
        function () {

            window.location.href =
                "tela_inicial.html";

        }
    );

}

// =========================================
// ABRIR / FECHAR MENU
// =========================================

if (btnMenu && menuDropdown) {

    btnMenu.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();

            menuDropdown.classList.toggle(
                "aberto"
            );

        }
    );

}

// =========================================
// FECHAR MENU AO CLICAR FORA
// =========================================

document.addEventListener(
    "click",
    function (evento) {

        if (
            menuDropdown &&
            btnMenu &&
            !menuDropdown.contains(evento.target) &&
            evento.target !== btnMenu
        ) {

            menuDropdown.classList.remove(
                "aberto"
            );

        }

    }
);

// =========================================
// OPÇÕES DO MENU
// =========================================

itensMenu.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function () {

                const acao =
                    item.dataset.acao;

                // =================================
                // LOGIN
                // =================================

                if (acao === "login") {

                    window.location.href =
                        "login.html";

                }

                // =================================
                // FAVORITOS
                // =================================

                else if (
                    acao === "favoritos"
                ) {

                    alert(
                        "A área de favoritos será integrada em uma próxima etapa."
                    );

                }

                // =================================
                // COMPARTILHAR
                // =================================

                else if (
                    acao === "compartilhar"
                ) {

                    compartilhar();

                }

                // =================================
                // CONFIGURAÇÕES
                // =================================

                else if (
                    acao === "configuracoes"
                ) {

                    alert(
                        "Tela de configurações em desenvolvimento."
                    );

                }

                // =================================
                // SAIR
                // =================================

                else if (
                    acao === "sair"
                ) {

                    const confirmar =
                        confirm(
                            "Deseja realmente sair?"
                        );

                    if (confirmar) {

                        window.location.href =
                            "tela_inicial.html";

                    }

                }

                // Fecha o menu

                if (menuDropdown) {

                    menuDropdown.classList.remove(
                        "aberto"
                    );

                }

            }
        );

    }
);

// =========================================
// COMPARTILHAR
// =========================================

async function compartilhar() {

    const texto =
        "Conheça o Transporte Fácil!";

    if (navigator.share) {

        try {

            await navigator.share({

                title:
                    "Transporte Fácil",

                text:
                    texto,

                url:
                    window.location.href

            });

        }

        catch (erro) {

            console.log(
                "Compartilhamento cancelado."
            );

        }

    }

    else {

        alert(
            "O compartilhamento não está disponível neste navegador."
        );

    }

}

// =========================================
// FORMATAR DIAS
// =========================================

function formatarDias(dias) {

    if (!dias) {

        return "Não informado";

    }

    const nomesDias = {

        segunda: "Segunda",
        terca: "Terça",
        terça: "Terça",
        quarta: "Quarta",
        quinta: "Quinta",
        sexta: "Sexta",
        sabado: "Sábado",
        sábado: "Sábado",
        domingo: "Domingo"

    };

    let lista = [];

    if (Array.isArray(dias)) {

        lista = dias;

    }

    else {

        lista =
            String(dias).split(",");

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
// CRIAR CARD DA ROTA
// =========================================

function criarCardRota(rota) {

    const card =
        document.createElement("article");

    card.className =
        "card-linha";

    // =================================
    // DADOS PARA A BUSCA
    // =================================

    card.dataset.nome =
        rota.nome ||
        rota.empresa ||
        "";

    card.dataset.origem =
        rota.origem ||
        "";

    card.dataset.destino =
        rota.destino ||
        "";

    // =================================
    // ÍCONE
    // =================================

    const icone =
        rota.tipo === "van"
            ? "🚐"
            : "🚌";

    // =================================
    // TIPO
    // =================================

    const tipo =
        formatarTipo(
            rota.tipo
        );

    // =================================
    // DIAS
    // =================================

    const dias =
        formatarDias(
            rota.dias
        );

    // =================================
    // INFORMAÇÕES
    // =================================

    const informacoes =
        rota.informacoes ||
        "Nenhuma informação adicional.";

    // =================================
    // NOME
    // =================================

    const nome =
        rota.nome ||
        rota.empresa ||
        "Transporte";

    // =================================
    // CARD
    // =================================

    card.innerHTML = `

        <div class="cabecalho-card">

            <div class="icone-onibus">
                ${icone}
            </div>

            <div class="informacoes">

                <h3>
                    ${nome}
                </h3>

                <p>
                    ${rota.origem || "Origem não informada"}
                    →
                    ${rota.destino || "Destino não informado"}
                </p>

            </div>

            <button
                class="btn-favorito"
                type="button"
                aria-label="Adicionar aos favoritos"
            >
                ♡
            </button>

        </div>


        <div class="detalhes">

            <div>

                <span>
                    Origem
                </span>

                <strong>
                    ${rota.origem || "Não informado"}
                </strong>

            </div>


            <div>

                <span>
                    Destino
                </span>

                <strong>
                    ${rota.destino || "Não informado"}
                </strong>

            </div>

        </div>


        <div class="detalhes">

            <div>

                <span>
                    Transporte
                </span>

                <strong>
                    ${tipo}
                </strong>

            </div>


            <div>

                <span>
                    Saída
                </span>

                <strong>
                    ${rota.horario_saida || "Não informado"}
                </strong>

            </div>

        </div>


        <div class="detalhes">

            <div>

                <span>
                    Chegada
                </span>

                <strong>
                    ${rota.horario_chegada || "Não informado"}
                </strong>

            </div>


            <div>

                <span>
                    Dias
                </span>

                <strong>
                    ${dias}
                </strong>

            </div>

        </div>


        <button
            class="btn-horarios"
            type="button"
        >
            Ver informações da rota
            <span>→</span>
        </button>

    `;

    // =================================
    // FAVORITO
    // =================================

    const botaoFavorito =
        card.querySelector(
            ".btn-favorito"
        );

    if (botaoFavorito) {

        botaoFavorito.addEventListener(
            "click",
            function () {

                botaoFavorito.classList.toggle(
                    "favoritado"
                );

                if (
                    botaoFavorito.classList.contains(
                        "favoritado"
                    )
                ) {

                    botaoFavorito.textContent =
                        "♥";

                    botaoFavorito.setAttribute(
                        "aria-label",
                        "Remover dos favoritos"
                    );

                }

                else {

                    botaoFavorito.textContent =
                        "♡";

                    botaoFavorito.setAttribute(
                        "aria-label",
                        "Adicionar aos favoritos"
                    );

                }

            }
        );

    }

    // =================================
    // BOTÃO DA ROTA
    // =================================

    const botaoRota =
        card.querySelector(
            ".btn-horarios"
        );

    if (botaoRota) {

        botaoRota.addEventListener(
            "click",
            function () {

                // =================================
                // VERIFICAR ID DA ROTA
                // =================================

                if (!rota.id) {

                    alert(
                        "Não foi possível identificar esta rota."
                    );

                    return;

                }

                // =================================
                // ABRIR TELA DE DETALHES
                // =================================

                window.location.href =
                    "detalhes_rota.html?id=" +
                    encodeURIComponent(
                        rota.id
                    );

            }
        );

    }

    return card;

}

// =========================================
// MOSTRAR ROTAS
// =========================================

function mostrarRotas(lista) {

    if (!listaLinhas) {

        return;

    }

    listaLinhas.innerHTML = "";

    if (
        !lista ||
        lista.length === 0
    ) {

        atualizarContador(0);

        if (semResultados) {

            semResultados.classList.add(
                "mostrar"
            );

        }

        return;

    }

    lista.forEach(
        function (rota) {

            const card =
                criarCardRota(
                    rota
                );

            listaLinhas.appendChild(
                card
            );

        }
    );

    atualizarContador(
        lista.length
    );

    if (semResultados) {

        semResultados.classList.remove(
            "mostrar"
        );

    }

}

// =========================================
// BUSCAR ROTAS DO BANCO
// =========================================

async function carregarRotas() {

    if (!listaLinhas) {

        return;

    }

    // =================================
    // MENSAGEM DE CARREGAMENTO
    // =================================

    listaLinhas.innerHTML = `

        <div class="carregando-rotas">

            <span>🔄</span>

            <p>
                Carregando rotas...
            </p>

        </div>

    `;

    try {

        const resposta =
            await fetch(
                API_URL + "/rotas"
            );

        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar as rotas."
            );

        }

        const dados =
            await resposta.json();

        rotas =
            dados.rotas || [];

        console.log(
            "Rotas recebidas do PostgreSQL:",
            rotas
        );

        mostrarRotas(
            rotas
        );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar rotas:",
            erro
        );

        listaLinhas.innerHTML = `

            <div class="carregando-rotas">

                <span>⚠️</span>

                <p>
                    Não foi possível carregar as rotas.
                </p>

                <button
                    id="btnTentarNovamente"
                    type="button"
                >
                    Tentar novamente
                </button>

            </div>

        `;

        atualizarContador(0);

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
// CAMPO DE BUSCA
// =========================================

if (campoBusca) {

    campoBusca.addEventListener(
        "input",
        function () {

            const termo =
                campoBusca.value
                    .toLowerCase()
                    .trim();

            if (!termo) {

                mostrarRotas(
                    rotas
                );

                return;

            }

            const resultados =
                rotas.filter(
                    function (rota) {

                        const nome =
                            (
                                rota.nome ||
                                rota.empresa ||
                                ""
                            ).toLowerCase();

                        const origem =
                            (
                                rota.origem ||
                                ""
                            ).toLowerCase();

                        const destino =
                            (
                                rota.destino ||
                                ""
                            ).toLowerCase();

                        return (
                            nome.includes(termo) ||
                            origem.includes(termo) ||
                            destino.includes(termo)
                        );

                    }
                );

            mostrarRotas(
                resultados
            );

        }
    );

}

// =========================================
// BOTÃO LIMPAR BUSCA
// =========================================

if (btnLimpar) {

    btnLimpar.addEventListener(
        "click",
        function () {

            if (campoBusca) {

                campoBusca.value = "";

                campoBusca.focus();

            }

            mostrarRotas(
                rotas
            );

        }
    );

}

// =========================================
// ATUALIZAR CONTADOR
// =========================================

function atualizarContador(
    quantidade
) {

    if (!contadorLinhas) {

        return;

    }

    if (quantidade === 0) {

        contadorLinhas.textContent =
            "0 linhas";

    }

    else if (quantidade === 1) {

        contadorLinhas.textContent =
            "1 linha";

    }

    else {

        contadorLinhas.textContent =
            quantidade + " linhas";

    }

}

// =========================================
// INICIAR TELA
// =========================================

carregarRotas();