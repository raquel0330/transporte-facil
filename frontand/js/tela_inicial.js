// =========================================
// TELA INICIAL - TRANSPORTE FÁCIL
// =========================================


// =========================================
// BOTÕES
// =========================================

const btnEntrar =
    document.getElementById("btnEntrar");

const btnAdministrativo =
    document.getElementById("btnAdministrativo");


// =========================================
// EVENTO DO BOTÃO ENTRAR
// =========================================

if (btnEntrar) {

    btnEntrar.addEventListener(
        "click",
        function () {

            console.log(
                "Botão Entrar clicado!"
            );


            // =================================
            // EFEITO VISUAL DO CLIQUE
            // =================================

            btnEntrar.style.transform =
                "scale(0.97)";


            // =================================
            // IR PARA A TELA PRINCIPAL
            // =================================

            setTimeout(
                function () {

                    window.location.href =
                        "./tela_principal.html";

                },
                150
            );

        }
    );

}


// =========================================
// EVENTO DA ÁREA ADMINISTRATIVA
// =========================================

if (btnAdministrativo) {

    btnAdministrativo.addEventListener(
        "click",
        function () {

            console.log(
                "Área administrativa selecionada."
            );


            // =================================
            // EFEITO VISUAL
            // =================================

            btnAdministrativo.style.transform =
                "scale(0.97)";


            // =================================
            // IR PARA A ÁREA ADMINISTRATIVA
            // =================================

            setTimeout(
                function () {

                    window.location.href =
                        "./login_admin.html";

                },
                150
            );

        }
    );

}