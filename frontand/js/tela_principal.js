// =========================================
// TELA PRINCIPAL - TRANSPORTE FÁCIL
// =========================================


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

const cards =
    document.querySelectorAll(".card-linha");

const itensMenu =
    document.querySelectorAll(".item-menu");

const botoesFavorito =
    document.querySelectorAll(".btn-favorito");

const botoesHorarios =
    document.querySelectorAll(".btn-horarios");


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
            !menuDropdown.contains(
                evento.target
            ) &&
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

                    // Vai para a tela de Login

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
                        "Tela de Favoritos em desenvolvimento."
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
                        "Tela de Configurações em desenvolvimento."
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


            let quantidadeEncontrada = 0;


            // Percorre os cards

            cards.forEach(
                function (card) {

                    const nome =
                        (
                            card.dataset.nome ||
                            ""
                        ).toLowerCase();


                    const origem =
                        (
                            card.dataset.origem ||
                            ""
                        ).toLowerCase();


                    const destino =
                        (
                            card.dataset.destino ||
                            ""
                        ).toLowerCase();


                    const encontrou =
                        nome.includes(termo) ||
                        origem.includes(termo) ||
                        destino.includes(termo);


                    if (encontrou) {

                        card.style.display =
                            "block";

                        quantidadeEncontrada++;

                    }

                    else {

                        card.style.display =
                            "none";

                    }

                }
            );


            // Atualiza contador

            atualizarContador(
                quantidadeEncontrada
            );


            // Mostra mensagem

            if (
                quantidadeEncontrada === 0
            ) {

                if (semResultados) {

                    semResultados.classList.add(
                        "mostrar"
                    );

                }

            }

            else {

                if (semResultados) {

                    semResultados.classList.remove(
                        "mostrar"
                    );

                }

            }

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

            }


            // Mostra todos os cards

            cards.forEach(
                function (card) {

                    card.style.display =
                        "block";

                }
            );


            // Atualiza contador

            atualizarContador(
                cards.length
            );


            // Esconde mensagem

            if (semResultados) {

                semResultados.classList.remove(
                    "mostrar"
                );

            }


            // Volta para o campo

            if (campoBusca) {

                campoBusca.focus();

            }

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
// FAVORITOS
// =========================================

botoesFavorito.forEach(
    function (botao) {

        botao.addEventListener(
            "click",
            function () {

                botao.classList.toggle(
                    "favoritado"
                );


                if (
                    botao.classList.contains(
                        "favoritado"
                    )
                ) {

                    botao.textContent =
                        "♥";


                    botao.setAttribute(
                        "aria-label",
                        "Remover dos favoritos"
                    );

                }

                else {

                    botao.textContent =
                        "♡";


                    botao.setAttribute(
                        "aria-label",
                        "Adicionar aos favoritos"
                    );

                }

            }
        );

    }
);


// =========================================
// BOTÕES "VER PARADAS E HORÁRIOS"
// =========================================
//
// Cada botão possui:
//
// data-rota="nome-do-arquivo.html"
//
// O JS pega esse caminho e abre a tela
// correspondente.
// =========================================

botoesHorarios.forEach(
    function (botao) {

        botao.addEventListener(
            "click",
            function () {

                const rota =
                    botao.dataset.rota;


                // Verifica se existe um caminho

                if (!rota) {

                    console.error(
                        "Nenhuma rota foi definida neste botão."
                    );

                    return;

                }


                console.log(
                    "Abrindo rota:",
                    rota
                );


                // Vai para a tela da rota

                window.location.href =
                    rota;

            }
        );

    }
);