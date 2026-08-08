// =========================================
// TELA INICIAL - TRANSPORTE FÁCIL
// =========================================

// Pegando o botão Entrar
const btnEntrar = document.getElementById("btnEntrar");


// =========================================
// EVENTO DO BOTÃO ENTRAR
// =========================================

btnEntrar.addEventListener("click", function () {

    console.log("Botão Entrar clicado!");


    // =====================================
    // EFEITO VISUAL DO CLIQUE
    // =====================================

    btnEntrar.style.transform = "scale(0.97)";


    // =====================================
    // IR PARA O DASHBOARD
    // =====================================

    setTimeout(function () {

        window.location.href = "./tela_principal.html";

    }, 150);

});