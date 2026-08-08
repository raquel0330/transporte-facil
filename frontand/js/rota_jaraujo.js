// =========================================
// ROTA J ARAÚJO
// TRANSPORTE FÁCIL
// =========================================


// =========================================
// ELEMENTOS
// =========================================

const btnVoltar =
    document.getElementById("btnVoltar");

const btnFavorito =
    document.getElementById("btnFavorito");

const horarios =
    document.querySelectorAll(".horario");


// =========================================
// BOTÃO VOLTAR
// =========================================

if (btnVoltar) 

    btnVoltar.addEventListener("click", function () {

        window.location.href = "tela_principal.html";

    });


// =========================================
// FAVORITO
// =========================================

btnFavorito.addEventListener(
    "click",
    function () {

        btnFavorito.classList.toggle(
            "favoritado"
        );


        if (
            btnFavorito.classList.contains(
                "favoritado"
            )
        ) {

            btnFavorito.textContent = "★";

            btnFavorito.setAttribute(
                "aria-label",
                "Remover dos favoritos"
            );

        } else {

            btnFavorito.textContent = "☆";

            btnFavorito.setAttribute(
                "aria-label",
                "Adicionar aos favoritos"
            );

        }

    }
);


// =========================================
// SELECIONAR HORÁRIO
// =========================================

horarios.forEach(
    function (horario) {

        horario.addEventListener(
            "click",
            function () {

                horarios.forEach(
                    function (outroHorario) {

                        outroHorario.classList.remove(
                            "selecionado"
                        );

                    }
                );


                horario.classList.add(
                    "selecionado"
                );

            }
        );

    }
);