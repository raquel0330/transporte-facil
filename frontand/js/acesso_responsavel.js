// =========================================
// ACESSO DO RESPONSÁVEL
// TRANSPORTE FÁCIL
// =========================================

// =========================================
// ENDEREÇO DA API
// =========================================

const API_URL = "https://transporte-facil-api.onrender.com";

// =========================================
// ELEMENTOS
// =========================================

const btnVoltar =
    document.getElementById("btnVoltar");

const formAcessoResponsavel =
    document.getElementById(
        "formAcessoResponsavel"
    );

const emailResponsavel =
    document.getElementById(
        "emailResponsavel"
    );

const codigoAcesso =
    document.getElementById(
        "codigoAcesso"
    );

const mensagem =
    document.getElementById(
        "mensagem"
    );


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
// MOSTRAR MENSAGEM
// =========================================

function mostrarMensagem(
    texto,
    tipo
) {

    if (!mensagem) {

        return;

    }


    mensagem.textContent =
        texto;

    mensagem.className =
        "mensagem " + tipo;

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
// ACESSAR ROTA
// =========================================

if (formAcessoResponsavel) {

    formAcessoResponsavel.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();


            limparMensagem();


            // =================================
            // PEGAR DADOS
            // =================================

            const email =
                emailResponsavel.value
                    .trim()
                    .toLowerCase();


            const codigo =
                codigoAcesso.value
                    .trim()
                    .toUpperCase();


            // =================================
            // VALIDAR E-MAIL
            // =================================

            if (!email) {

                mostrarMensagem(
                    "Informe o e-mail cadastrado.",
                    "erro"
                );

                emailResponsavel.focus();

                return;

            }


            // =================================
            // VALIDAR CÓDIGO
            // =================================

            if (!codigo) {

                mostrarMensagem(
                    "Informe o código de acesso.",
                    "erro"
                );

                codigoAcesso.focus();

                return;

            }


            if (codigo.length !== 6) {

                mostrarMensagem(
                    "O código de acesso deve possuir 6 caracteres.",
                    "erro"
                );

                codigoAcesso.focus();

                return;

            }


            // =================================
            // BOTÃO
            // =================================

            const botao =
                formAcessoResponsavel.querySelector(
                    'button[type="submit"]'
                );


            if (botao) {

                botao.disabled =
                    true;

                botao.textContent =
                    "Verificando...";

            }


            try {

                // =================================
                // ENVIAR PARA O BACKEND
                // =================================

                const resposta =
                    await fetch(
                        API_URL +
                        "/responsavel/login",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    email:
                                        email,

                                    codigo:
                                        codigo

                                })

                        }
                    );


                // =================================
                // LER RESPOSTA
                // =================================

                const resultado =
                    await resposta.json();


                // =================================
                // VERIFICAR RESPOSTA
                // =================================

                if (!resposta.ok) {

                    throw new Error(
                        resultado.mensagem ||
                        "E-mail ou código de acesso inválido."
                    );

                }


                // =================================
                // PEGAR ROTA
                // =================================

                const rota =
                    resultado.rota;


                if (!rota) {

                    throw new Error(
                        "A rota não foi encontrada."
                    );

                }


                // =================================
                // SALVAR ROTA NA SESSÃO
                // =================================
                //
                // Esses dados serão utilizados
                // pela area_responsavel.html
                //
                // =================================

                sessionStorage.setItem(
                    "rotaResponsavel",
                    JSON.stringify(rota)
                );


                // =================================
                // MENSAGEM DE SUCESSO
                // =================================

                mostrarMensagem(
                    "Acesso realizado com sucesso!",
                    "sucesso"
                );


                // =================================
                // IR PARA ÁREA DO RESPONSÁVEL
                // =================================

                setTimeout(
                    function () {

                        window.location.href =
                            "area_responsavel.html";

                    },
                    500
                );

            }


            catch (erro) {

                console.error(
                    "Erro ao acessar rota:",
                    erro
                );


                mostrarMensagem(
                    erro.message ||
                    "Não foi possível acessar a rota.",
                    "erro"
                );

            }


            finally {

                // =================================
                // REATIVAR BOTÃO
                // =================================

                if (botao) {

                    botao.disabled =
                        false;

                    botao.textContent =
                        "Acessar minha rota";

                }

            }

        }
    );

}


// =========================================
// DEIXAR CÓDIGO SEMPRE EM MAIÚSCULO
// =========================================

if (codigoAcesso) {

    codigoAcesso.addEventListener(
        "input",
        function () {

            codigoAcesso.value =
                codigoAcesso.value
                    .toUpperCase()
                    .replace(
                        /[^A-Z0-9]/g,
                        ""
                    );

        }
    );

}