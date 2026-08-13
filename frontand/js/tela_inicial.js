// =========================================
// TELA INICIAL - TRANSPORTE FÁCIL
// =========================================


// =========================================
// BOTÃO ENTRAR
// =========================================

const btnEntrar =
    document.getElementById("btnEntrar");


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