// =========================================
// CRIAR / EDITAR ROTA
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
// VERIFICAR SE ESTAMOS EDITANDO
// =========================================

const parametros =
    new URLSearchParams(
        window.location.search
    );

const idRota =
    parametros.get("id");


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
                    idRota
                        ? "Deseja cancelar a edição da rota?"
                        : "Deseja cancelar o cadastro da rota?"
                );


            if (confirmar) {

                window.location.href =
                    "dashboard.html";

            }

        }
    );

}


// =========================================
// CARREGAR ROTA PARA EDIÇÃO
// =========================================

async function carregarRotaParaEditar() {

    if (!idRota) {

        return;

    }


    try {

        const resposta =
            await fetch(
                "http://localhost:3000/rotas/" +
                idRota
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Erro ao carregar a rota."
            );

        }


        const rota =
            dados.rota;


        // =================================
        // PREENCHER CAMPOS
        // =================================

        document.getElementById(
            "nomeEmpresa"
        ).value =
            rota.nome || "";


        document.getElementById(
            "origem"
        ).value =
            rota.origem || "";


        document.getElementById(
            "destino"
        ).value =
            rota.destino || "";


        document.getElementById(
            "tipoTransporte"
        ).value =
            rota.tipo || "";


        document.getElementById(
            "horarioSaida"
        ).value =
            rota.horario_saida || "";


        document.getElementById(
            "horarioChegada"
        ).value =
            rota.horario_chegada || "";


        document.getElementById(
            "informacoes"
        ).value =
            rota.informacoes || "";


        // =================================
        // MARCAR DIAS
        // =================================

        const diasDaRota =
            rota.dias
                ? rota.dias.split(",")
                : [];


        const caixasDias =
            document.querySelectorAll(
                'input[name="dias"]'
            );


        caixasDias.forEach(
            function (caixa) {

                caixa.checked =
                    diasDaRota.includes(
                        caixa.value
                    );

            }
        );


        // =================================
        // ALTERAR TÍTULOS DA PÁGINA
        // =================================

        const titulo =
            document.querySelector(
                ".titulo-cabecalho h1"
            );


        if (titulo) {

            titulo.textContent =
                "Editar rota";

        }


        const subtitulo =
            document.querySelector(
                ".introducao h2"
            );


        if (subtitulo) {

            subtitulo.textContent =
                "Editar rota cadastrada";

        }


        const descricao =
            document.querySelector(
                ".introducao p"
            );


        if (descricao) {

            descricao.textContent =
                "Altere as informações da rota e salve as mudanças.";

        }


        const botaoCadastrar =
            formCriarRota.querySelector(
                'button[type="submit"]'
            );


        if (botaoCadastrar) {

            botaoCadastrar.textContent =
                "Salvar alterações";

        }

    }

    catch (erro) {

        console.error(
            "Erro ao carregar rota:",
            erro
        );


        alert(
            "Não foi possível carregar os dados da rota."
        );


        window.location.href =
            "dashboard.html";

    }

}


// =========================================
// ENVIAR FORMULÁRIO
// =========================================

if (formCriarRota) {

    formCriarRota.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();


            // =================================
            // PEGAR DADOS
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
            // DIAS
            // =================================

            const diasSelecionados =
                document.querySelectorAll(
                    'input[name="dias"]:checked'
                );


            if (
                diasSelecionados.length === 0
            ) {

                alert(
                    "Selecione pelo menos um dia de funcionamento."
                );

                return;

            }


            const dias = [];


            diasSelecionados.forEach(
                function (dia) {

                    dias.push(
                        dia.value
                    );

                }
            );


            // =================================
            // OBJETO
            // =================================

            const dadosRota = {

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


            console.log(
                idRota
                    ? "Atualizando rota:"
                    : "Cadastrando rota:",
                dadosRota
            );


            // =================================
            // ESCOLHER MÉTODO
            // =================================

            const metodo =
                idRota
                    ? "PUT"
                    : "POST";


            const endereco =
                idRota
                    ? "http://localhost:3000/rotas/" + idRota
                    : "http://localhost:3000/rotas";


            // =================================
            // ENVIAR PARA O BACKEND
            // =================================

            try {

                const resposta =
                    await fetch(
                        endereco,
                        {
                            method: metodo,

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    dadosRota
                                )

                        }
                    );


                const resultado =
                    await resposta.json();


                // =================================
                // VERIFICAR RESPOSTA
                // =================================

                if (!resposta.ok) {

                    throw new Error(
                        resultado.mensagem ||
                        "Erro ao salvar a rota."
                    );

                }


                console.log(
                    "Rota salva:",
                    resultado.rota
                );


                alert(
                    idRota
                        ? "Rota atualizada com sucesso!"
                        : "Rota cadastrada com sucesso!"
                );


                // =================================
                // VOLTAR AO DASHBOARD
                // =================================

                window.location.href =
                    "dashboard.html";

            }

            catch (erro) {

                console.error(
                    "Erro:",
                    erro
                );


                alert(
                    idRota
                        ? "Não foi possível atualizar a rota."
                        : "Não foi possível cadastrar a rota."
                );

            }

        }
    );

}


// =========================================
// EXECUTAR
// =========================================

carregarRotaParaEditar();