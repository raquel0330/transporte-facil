// =========================================
// DASHBOARD ADMINISTRATIVO
// TRANSPORTE FÁCIL
// =========================================

// =========================================
// ELEMENTOS DA TELA
// =========================================

const btnSair =
document.getElementById("btnSair");

const btnAdicionarRota =
document.getElementById("btnAdicionarRota");

const cardsAcao =
document.querySelectorAll(".card-acao");

const botoesEditar =
document.querySelectorAll(".btn-editar");


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

                else if (acao === "horarios") {

                    alert(
                        "Área de gerenciamento de horários em desenvolvimento."
                    );

                }


                // =================================
                // VEÍCULOS
                // =================================

                else if (acao === "veiculos") {

                    alert(
                        "Área de gerenciamento de veículos em desenvolvimento."
                    );

                }


                // =================================
                // AGÊNCIAS
                // =================================

                else if (acao === "agencias") {

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
// EDITAR ROTAS
// =========================================

botoesEditar.forEach(
    function (botao) {

        botao.addEventListener(
            "click",
            function () {

                const nomeRota =
                    botao.dataset.rota;


                alert(
                    "Você selecionou a rota:\n\n" +
                    nomeRota +
                    "\n\nA edição desta rota será implementada posteriormente."
                );

            }
        );

    }
);