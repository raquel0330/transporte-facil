// =========================================
// LOGIN - TRANSPORTE FÁCIL
// =========================================


// =========================================
// ELEMENTOS
// =========================================

const formLogin =
    document.getElementById("formLogin");

const btnUsuario =
    document.getElementById("btnUsuario");

const btnAdministrador =
    document.getElementById("btnAdministrador");

const email =
    document.getElementById("email");

const senha =
    document.getElementById("senha");

const btnMostrarSenha =
    document.getElementById("btnMostrarSenha");

const mensagemErro =
    document.getElementById("mensagemErro");

const btnVoltar =
    document.getElementById("btnVoltar");


// =========================================
// TIPO DE USUÁRIO
// =========================================

let tipoUsuario = "usuario";


// =========================================
// SELECIONAR USUÁRIO
// =========================================

btnUsuario.addEventListener(
    "click",
    function () {

        tipoUsuario = "usuario";

        btnUsuario.classList.add("ativo");

        btnAdministrador.classList.remove("ativo");

        mensagemErro.textContent = "";

    }
);


// =========================================
// SELECIONAR ADMINISTRADOR
// =========================================

btnAdministrador.addEventListener(
    "click",
    function () {

        tipoUsuario = "administrador";

        btnAdministrador.classList.add("ativo");

        btnUsuario.classList.remove("ativo");

        mensagemErro.textContent = "";

    }
);


// =========================================
// MOSTRAR / ESCONDER SENHA
// =========================================

btnMostrarSenha.addEventListener(
    "click",
    function () {

        if (senha.type === "password") {

            senha.type = "text";

            btnMostrarSenha.textContent = "🙈";

        }

        else {

            senha.type = "password";

            btnMostrarSenha.textContent = "👁";

        }

    }
);


// =========================================
// LOGIN
// =========================================

formLogin.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        const emailDigitado =
            email.value.trim();

        const senhaDigitada =
            senha.value.trim();


        mensagemErro.textContent = "";


        // =================================
        // USUÁRIO DE TESTE
        // =================================

        if (tipoUsuario === "usuario") {

            if (
                emailDigitado === "usuario@teste.com" &&
                senhaDigitada === "123456"
            ) {

                window.location.href =
                    "tela_principal.html";

            }

            else {

                mensagemErro.textContent =
                    "E-mail ou senha incorretos.";

            }

        }


        // =================================
        // ADMINISTRADOR DE TESTE
        // =================================

        else if (tipoUsuario === "administrador") {

            if (
                emailDigitado === "admin@teste.com" &&
                senhaDigitada === "admin123"
            ) {

                window.location.href =
                    "dashboard.html";

            }

            else {

                mensagemErro.textContent =
                    "E-mail ou senha de administrador incorretos.";

            }

        }

    }
);


// =========================================
// BOTÃO VOLTAR
// =========================================

btnVoltar.addEventListener(
    "click",
    function () {

        window.location.href =
            "tela_principal.html";

    }
);