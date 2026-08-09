// =========================================
// LOGIN ADMINISTRATIVO
// TRANSPORTE FÁCIL
// =========================================


// =========================================
// ELEMENTOS
// =========================================

const formLogin =
document.getElementById("formLogin");


const btnVoltar =
document.getElementById("btnVoltar");



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
// LOGIN
// =========================================

if (formLogin) {

    formLogin.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();



            // =================================
            // PEGAR DADOS
            // =================================

            const usuario =
                document.getElementById(
                    "usuario"
                ).value.trim();



            const senha =
                document.getElementById(
                    "senha"
                ).value;



            // =================================
            // CREDENCIAIS TEMPORÁRIAS
            // =================================

            const usuarioCorreto =
                "admin@teste.com";


            const senhaCorreta =
                "admin123";



            // =================================
            // VERIFICAR LOGIN
            // =================================

            if (
                usuario === usuarioCorreto &&
                senha === senhaCorreta
            ) {


                console.log(
                    "Login administrativo realizado."
                );



                // =================================
                // CRIAR SESSÃO ADMINISTRATIVA
                // =================================

                sessionStorage.setItem(
                    "adminLogado",
                    "true"
                );



                // =================================
                // IR PARA O DASHBOARD
                // =================================

                window.location.href =
                    "dashboard.html";


            }


            else {


                alert(
                    "Usuário ou senha incorretos."
                );


            }


        }
    );

}