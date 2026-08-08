// =========================================
// CRIAR ROTA
// TRANSPORTE FÁCIL
// =========================================


// =========================================
// ELEMENTOS
// =========================================

const btnVoltar =
    document.getElementById("btnVoltar");

const btnCancelar =
    document.getElementById("btnCancelar");

const formCriarRota =
    document.getElementById("formCriarRota");


// =========================================
// BOTÃO VOLTAR
// =========================================

if (btnVoltar) {

    btnVoltar.addEventListener(
        "click",
        function () {

            window.location.href =
                "dashboard.html";

        }
    );

}


// =========================================
// BOTÃO CANCELAR
// =========================================

if (btnCancelar) {

    btnCancelar.addEventListener(
        "click",
        function () {

            const confirmar =
                confirm(
                    "Deseja cancelar o cadastro da rota?"
                );


            if (confirmar) {

                window.location.href =
                    "dashboard.html";

            }

        }
    );

}


// =========================================
// CADASTRAR ROTA
// =========================================

if (formCriarRota) {

    formCriarRota.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            // =================================
            // PEGAR OS DADOS
            // =================================

            const nomeEmpresa =
                document.getElementById(
                    "nomeEmpresa"
                ).value.trim();


            const origem =
                document.getElementById(
                    "origem"
                ).value.trim();


            const destino =
                document.getElementById(
                    "destino"
                ).value.trim();


            const tipoTransporte =
                document.getElementById(
                    "tipoTransporte"
                ).value;


            const horarioSaida =
                document.getElementById(
                    "horarioSaida"
                ).value;


            const horarioChegada =
                document.getElementById(
                    "horarioChegada"
                ).value;


            const informacoes =
                document.getElementById(
                    "informacoes"
                ).value.trim();


            // =================================
            // DIAS SELECIONADOS
            // =================================

            const diasSelecionados =
                document.querySelectorAll(
                    'input[name="dias"]:checked'
                );


            // =================================
            // VERIFICAR DIAS
            // =================================

            if (diasSelecionados.length === 0) {

                alert(
                    "Selecione pelo menos um dia de funcionamento."
                );

                return;

            }


            // =================================
            // MONTAR LISTA DE DIAS
            // =================================

            const dias = [];


            diasSelecionados.forEach(
                function (dia) {

                    dias.push(
                        dia.value
                    );

                }
            );


            // =================================
            // OBJETO DA ROTA
            // =================================

            const novaRota = {

                empresa:
                    nomeEmpresa,

                origem:
                    origem,

                destino:
                    destino,

                tipo:
                    tipoTransporte,

                horarioSaida:
                    horarioSaida,

                horarioChegada:
                    horarioChegada,

                dias:
                    dias,

                informacoes:
                    informacoes

            };


            // =================================
            // MOSTRAR NO CONSOLE
            // =================================

            console.log(
                "Nova rota cadastrada:",
                novaRota
            );


            // =================================
            // MENSAGEM
            // =================================

            alert(
                "Rota cadastrada com sucesso!"
            );


            // =================================
            // VOLTAR PARA O DASHBOARD
            // =================================

            window.location.href =
                "dashboard.html";

        }
    );

}