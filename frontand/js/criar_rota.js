// =========================================
// CRIAR / EDITAR ROTA
// TRANSPORTE FÁCIL
// =========================================


// =========================================
// ENDEREÇO DA API
// =========================================

const API_URL =
    "https://transporte-facil-api.onrender.com";


// =========================================
// ELEMENTOS
// =========================================

const formRota =
    document.getElementById("formRota");

const btnVoltar =
    document.getElementById("btnVoltar");

const btnCancelar =
    document.getElementById("btnCancelar");

const btnSalvar =
    document.getElementById("btnSalvar");

const btnAdicionarHorario =
    document.getElementById("btnAdicionarHorario");

const listaHorariosExtras =
    document.getElementById("listaHorariosExtras");

const mensagem =
    document.getElementById("mensagem");

const tituloFormulario =
    document.getElementById("tituloFormulario");


// =========================================
// IDENTIFICAR EDIÇÃO
// =========================================

const parametros =
    new URLSearchParams(
        window.location.search
    );

const idRota =
    parametros.get("id");


// =========================================
// CONTADOR DE HORÁRIOS
// =========================================

let contadorHorarios = 2;


// =========================================
// VOLTAR
// =========================================

function voltarDashboard() {

    window.location.href =
        "dashboard.html";

}


if (btnVoltar) {

    btnVoltar.addEventListener(
        "click",
        voltarDashboard
    );

}


if (btnCancelar) {

    btnCancelar.addEventListener(
        "click",
        voltarDashboard
    );

}


// =========================================
// MENSAGEM
// =========================================

function mostrarMensagem(
    textoMensagem,
    tipo = "erro"
) {

    if (!mensagem) {
        return;
    }

    mensagem.textContent =
        textoMensagem;

    mensagem.className =
        "mensagem mostrar " + tipo;

}


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
// ERROS VISUAIS
// =========================================

function limparErros() {

    document
        .querySelectorAll(".campo-erro")
        .forEach(
            function (campo) {

                campo.classList.remove(
                    "campo-erro"
                );

            }
        );

}


function marcarErro(elemento) {

    if (!elemento) {
        return;
    }

    elemento.classList.add(
        "campo-erro"
    );

}


// =========================================
// ADICIONAR HORÁRIO EXTRA
// =========================================

function adicionarHorarioExtra(
    saida = "",
    chegada = ""
) {

    if (!listaHorariosExtras) {
        return;
    }


    contadorHorarios++;


    const horario =
        document.createElement("div");


    horario.className =
        "horario-item horario-extra";


    horario.dataset.id =
        contadorHorarios;


    horario.innerHTML = `

        <div class="numero-horario">
            ${contadorHorarios}
        </div>

        <div class="campo-horario">

            <label>
                Saída
            </label>

            <input
                type="time"
                class="horario-saida"
                value="${saida}"
            >

        </div>

        <div class="campo-horario">

            <label>
                Chegada
            </label>

            <input
                type="time"
                class="horario-chegada"
                value="${chegada}"
            >

        </div>

        <button
            type="button"
            class="btn-remover-horario"
        >
            ×
        </button>
    `;


    listaHorariosExtras.appendChild(
        horario
    );


    const btnRemover =
        horario.querySelector(
            ".btn-remover-horario"
        );


    if (btnRemover) {

        btnRemover.addEventListener(
            "click",
            function () {

                horario.remove();

            }
        );

    }

}


// =========================================
// BOTÃO ADICIONAR HORÁRIO
// =========================================

if (btnAdicionarHorario) {

    btnAdicionarHorario.addEventListener(
        "click",
        function () {

            adicionarHorarioExtra();

        }
    );

}


// =========================================
// OBTER DIAS SELECIONADOS
// =========================================

function obterDiasSelecionados() {

    const checkboxes =
        document.querySelectorAll(
            'input[name="dias"]:checked'
        );


    return Array.from(
        checkboxes
    ).map(
        function (checkbox) {

            return checkbox.value;

        }
    );

}


// =========================================
// OBTER HORÁRIOS
// =========================================
//
// Horários são opcionais.
//
// Se todos estiverem vazios:
// retorna [].
//
// Se algum estiver preenchido:
// precisa completar saída + chegada.
// =========================================

function obterHorarios() {

    const horarios = [];


    // =====================================
    // HORÁRIO 1
    // =====================================

    const saida1 =
        document.getElementById(
            "saida1"
        )?.value || "";


    const chegada1 =
        document.getElementById(
            "chegada1"
        )?.value || "";


    if (
        saida1 ||
        chegada1
    ) {

        horarios.push({

            saida:
                saida1,

            chegada:
                chegada1

        });

    }


    // =====================================
    // HORÁRIO 2
    // =====================================

    const saida2 =
        document.getElementById(
            "saida2"
        )?.value || "";


    const chegada2 =
        document.getElementById(
            "chegada2"
        )?.value || "";


    if (
        saida2 ||
        chegada2
    ) {

        horarios.push({

            saida:
                saida2,

            chegada:
                chegada2

        });

    }


    // =====================================
    // HORÁRIOS EXTRAS
    // =====================================

    document
        .querySelectorAll(
            ".horario-extra"
        )
        .forEach(
            function (item) {

                const saida =
                    item.querySelector(
                        ".horario-saida"
                    )?.value || "";


                const chegada =
                    item.querySelector(
                        ".horario-chegada"
                    )?.value || "";


                if (
                    saida ||
                    chegada
                ) {

                    horarios.push({

                        saida:
                            saida,

                        chegada:
                            chegada

                    });

                }

            }
        );


    return horarios;

}


// =========================================
// PREENCHER DIAS
// =========================================

function preencherDias(dias) {

    if (!dias) {
        return;
    }


    let lista =
        dias;


    if (
        typeof dias === "string"
    ) {

        lista =
            dias.split(",");

    }


    lista =
        lista.map(
            function (dia) {

                return String(dia)
                    .trim()
                    .toLowerCase();

            }
        );


    document
        .querySelectorAll(
            'input[name="dias"]'
        )
        .forEach(
            function (checkbox) {

                checkbox.checked =
                    lista.includes(
                        checkbox.value
                    );

            }
        );

}


// =========================================
// PREENCHER HORÁRIOS
// =========================================

function preencherHorarios(horarios) {

    if (!horarios) {
        return;
    }


    let lista = [];


    // =====================================
    // FORMATO OBJETO
    // =====================================

    if (
        typeof horarios === "object" &&
        !Array.isArray(horarios)
    ) {

        if (
            Array.isArray(
                horarios.horarios
            )
        ) {

            lista =
                horarios.horarios;

        }

        else {

            const dias =
                Object.keys(
                    horarios
                );


            for (
                const dia of dias
            ) {

                if (
                    Array.isArray(
                        horarios[dia]
                    )
                ) {

                    lista =
                        horarios[dia];

                    break;

                }

            }

        }

    }


    // =====================================
    // ARRAY DIRETO
    // =====================================

    else if (
        Array.isArray(horarios)
    ) {

        lista =
            horarios;

    }


    if (
        !Array.isArray(lista)
    ) {

        return;

    }


    // =====================================
    // HORÁRIO 1
    // =====================================

    if (lista[0]) {

        const saida1 =
            document.getElementById(
                "saida1"
            );


        const chegada1 =
            document.getElementById(
                "chegada1"
            );


        if (saida1) {

            saida1.value =
                lista[0].saida || "";

        }


        if (chegada1) {

            chegada1.value =
                lista[0].chegada || "";

        }

    }


    // =====================================
    // HORÁRIO 2
    // =====================================

    if (lista[1]) {

        const saida2 =
            document.getElementById(
                "saida2"
            );


        const chegada2 =
            document.getElementById(
                "chegada2"
            );


        if (saida2) {

            saida2.value =
                lista[1].saida || "";

        }


        if (chegada2) {

            chegada2.value =
                lista[1].chegada || "";

        }

    }


    // =====================================
    // HORÁRIOS EXTRAS
    // =====================================

    for (
        let i = 2;
        i < lista.length;
        i++
    ) {

        adicionarHorarioExtra(

            lista[i].saida || "",

            lista[i].chegada || ""

        );

    }

}


// =========================================
// VALIDAR FORMULÁRIO
// =========================================

function validarFormulario() {

    limparErros();


    // =====================================
    // EMPRESA
    // =====================================

    const empresa =
        document.getElementById(
            "empresa"
        );


    if (
        !empresa ||
        !empresa.value.trim()
    ) {

        mostrarMensagem(
            "Preencha o campo Empresa / Agência."
        );

        marcarErro(
            empresa
        );

        empresa?.focus();

        return false;

    }


    // =====================================
    // E-MAIL
    // =====================================

    const email =
        document.getElementById(
            "emailResponsavel"
        );


    const emailTexto =
        email?.value.trim() || "";


    if (!emailTexto) {

        mostrarMensagem(
            "Preencha o campo E-mail do responsável."
        );

        marcarErro(
            email
        );

        email?.focus();

        return false;

    }


    const emailValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailValido.test(
            emailTexto
        )
    ) {

        mostrarMensagem(
            "Digite um e-mail válido."
        );

        marcarErro(
            email
        );

        email?.focus();

        return false;

    }


    // =====================================
    // ORIGEM
    // =====================================

    const origem =
        document.getElementById(
            "origem"
        );


    if (
        !origem ||
        !origem.value.trim()
    ) {

        mostrarMensagem(
            "Preencha o campo Origem."
        );

        marcarErro(
            origem
        );

        origem?.focus();

        return false;

    }


    // =====================================
    // DESTINO
    // =====================================

    const destino =
        document.getElementById(
            "destino"
        );


    if (
        !destino ||
        !destino.value.trim()
    ) {

        mostrarMensagem(
            "Preencha o campo Destino."
        );

        marcarErro(
            destino
        );

        destino?.focus();

        return false;

    }


    // =====================================
    // TIPO
    // =====================================

    const tipo =
        document.getElementById(
            "tipo"
        );


    if (
        !tipo ||
        !tipo.value
    ) {

        mostrarMensagem(
            "Selecione o Tipo de transporte."
        );

        marcarErro(
            tipo
        );

        tipo?.focus();

        return false;

    }


    // =====================================
    // DIAS
    // =====================================

    const dias =
        obterDiasSelecionados();


    if (
        dias.length === 0
    ) {

        mostrarMensagem(
            "Selecione pelo menos um dia de funcionamento."
        );

        const primeiroDia =
            document.querySelector(
                'input[name="dias"]'
            );


        primeiroDia?.focus();

        return false;

    }


    // =====================================
    // HORÁRIOS
    // =====================================

    const horarios =
        obterHorarios();


    for (
        let i = 0;
        i < horarios.length;
        i++
    ) {

        const horario =
            horarios[i];


        if (
            horario.saida &&
            !horario.chegada
        ) {

            mostrarMensagem(
                `Complete o horário ${i + 1}: informe a chegada.`
            );

            return false;

        }


        if (
            !horario.saida &&
            horario.chegada
        ) {

            mostrarMensagem(
                `Complete o horário ${i + 1}: informe a saída.`
            );

            return false;

        }

    }


    return true;

}


// =========================================
// CARREGAR ROTA PARA EDIÇÃO
// =========================================

async function carregarRota() {

    if (!idRota) {

        return;

    }


    // =====================================
    // MODO EDIÇÃO
    // =====================================

    if (tituloFormulario) {

        tituloFormulario.textContent =
            "Editar rota";

    }


    if (btnSalvar) {

        btnSalvar.textContent =
            "Salvar edição";

    }


    try {

        const resposta =
            await fetch(
                API_URL +
                "/rotas/" +
                encodeURIComponent(
                    idRota
                )
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Não foi possível carregar a rota."
            );

        }


        const rota =
            dados.rota;


        // =====================================
        // EMPRESA
        // =====================================

        const empresa =
            document.getElementById(
                "empresa"
            );


        if (empresa) {

            empresa.value =
                rota.nome ||
                rota.empresa ||
                "";

        }


        // =====================================
        // E-MAIL
        // =====================================

        const email =
            document.getElementById(
                "emailResponsavel"
            );


        if (email) {

            email.value =
                rota.email_responsavel ||
                rota.emailResponsavel ||
                "";

        }


        // =====================================
        // ORIGEM
        // =====================================

        const origem =
            document.getElementById(
                "origem"
            );


        if (origem) {

            origem.value =
                rota.origem ||
                "";

        }


        // =====================================
        // DESTINO
        // =====================================

        const destino =
            document.getElementById(
                "destino"
            );


        if (destino) {

            destino.value =
                rota.destino ||
                "";

        }


        // =====================================
        // VIA
        // =====================================

        const via =
            document.getElementById(
                "via"
            );


        if (via) {

            via.value =
                rota.via ||
                "";

        }


        // =====================================
        // TIPO
        // =====================================

        const tipo =
            document.getElementById(
                "tipo"
            );


        if (tipo) {

            tipo.value =
                rota.tipo ||
                "";

        }


        // =====================================
        // DIAS
        // =====================================

        preencherDias(
            rota.dias
        );


        // =====================================
        // HORÁRIOS
        // =====================================

        preencherHorarios(
            rota.horarios
        );


        // =====================================
        // INFORMAÇÕES
        // =====================================

        const informacoes =
            document.getElementById(
                "informacoes"
            );


        if (informacoes) {

            informacoes.value =
                rota.informacoes ||
                "";

        }

    }

    catch (erro) {

        console.error(
            "Erro ao carregar rota:",
            erro
        );


        mostrarMensagem(
            erro.message ||
            "Não foi possível carregar os dados da rota."
        );

    }

}


// =========================================
// SALVAR
// =========================================

if (formRota) {

    formRota.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();


            limparMensagem();


            // =================================
            // VALIDAR
            // =================================

            if (
                !validarFormulario()
            ) {

                return;

            }


            // =================================
            // CAMPOS
            // =================================

            const empresa =
                document.getElementById(
                    "empresa"
                )
                    .value
                    .trim();


            const emailResponsavel =
                document.getElementById(
                    "emailResponsavel"
                )
                    .value
                    .trim();


            const origem =
                document.getElementById(
                    "origem"
                )
                    .value
                    .trim();


            const destino =
                document.getElementById(
                    "destino"
                )
                    .value
                    .trim();


            const via =
                document.getElementById(
                    "via"
                )
                    .value
                    .trim();


            const tipo =
                document.getElementById(
                    "tipo"
                )
                    .value;


            const informacoes =
                document.getElementById(
                    "informacoes"
                )
                    .value
                    .trim();


            const dias =
                obterDiasSelecionados();


            const horarios =
                obterHorarios();


            // =================================
            // OBJETO
            // =================================

            const dados = {

                empresa:
                    empresa,

                emailResponsavel:
                    emailResponsavel,

                origem:
                    origem,

                destino:
                    destino,

                via:
                    via,

                tipo:
                    tipo,

                dias:
                    dias,

                horarios:
                    horarios,

                informacoes:
                    informacoes

            };


            console.log(
                "================================="
            );

            console.log(
                "DADOS ENVIADOS PARA API:"
            );

            console.log(
                dados
            );

            console.log(
                "================================="
            );


            // =================================
            // BOTÃO
            // =================================

            if (btnSalvar) {

                btnSalvar.disabled =
                    true;

                btnSalvar.textContent =
                    idRota
                        ? "Salvando..."
                        : "Cadastrando...";

            }


            try {

                // =================================
                // DEFINIR URL
                // =================================

                const url =
                    idRota
                        ? API_URL +
                          "/rotas/" +
                          encodeURIComponent(
                              idRota
                          )
                        : API_URL +
                          "/rotas";


                // =================================
                // ENVIAR PARA API
                // =================================

                const resposta =
                    await fetch(
                        url,
                        {

                            method:
                                idRota
                                    ? "PUT"
                                    : "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    dados
                                )

                        }
                    );


                // =================================
                // LER RESPOSTA
                // =================================

                let resultado = {};


                try {

                    resultado =
                        await resposta.json();

                }

                catch (erroJson) {

                    console.error(
                        "Resposta não é JSON:",
                        erroJson
                    );

                }


                // =================================
                // ERRO DA API
                // =================================

                if (!resposta.ok) {

                    let mensagemErro =
                        resultado.mensagem ||
                        resultado.erro ||
                        "A API não conseguiu salvar a rota.";


                    if (
                        Array.isArray(
                            resultado.camposPendentes
                        )
                    ) {

                        mensagemErro +=
                            " Campos: " +
                            resultado.camposPendentes.join(
                                ", "
                            );

                    }


                    throw new Error(
                        mensagemErro
                    );

                }


                // =================================
                // PEGAR ROTA SALVA
                // =================================

                const rotaSalva =
                    resultado.rota || {};


                // =================================
                // PEGAR CÓDIGO DE ACESSO
                // =================================

                const codigoAcesso =
                    rotaSalva.codigo_acesso ||
                    rotaSalva.codigoAcesso ||
                    "";


                console.log(
                    "================================="
                );

                console.log(
                    "ROTA SALVA:"
                );

                console.log(
                    rotaSalva
                );

                console.log(
                    "CÓDIGO DE ACESSO:"
                );

                console.log(
                    codigoAcesso
                );

                console.log(
                    "================================="
                );


                // =================================
                // SUCESSO
                // =================================

                mostrarMensagem(

                    idRota
                        ? "Rota atualizada com sucesso!"
                        : "Rota cadastrada com sucesso!",

                    "sucesso"

                );


                // =================================
                // CADASTRO NOVO
                // =================================

                if (!idRota) {

                    // =================================
                    // MOSTRAR CÓDIGO
                    // =================================

                    if (codigoAcesso) {

                        alert(
                            "ROTA CADASTRADA COM SUCESSO!\n\n" +
                            "Empresa: " +
                            empresa +
                            "\n\n" +
                            "Código de acesso:\n" +
                            codigoAcesso +
                            "\n\n" +
                            "Guarde este código para fornecer à empresa."
                        );

                    }

                    else {

                        alert(
                            "Rota cadastrada com sucesso!\n\n" +
                            "Porém, a API não retornou o código de acesso."
                        );

                    }

                }


                // =================================
                // VOLTAR PARA O DASHBOARD
                // =================================

                setTimeout(
                    function () {

                        window.location.href =
                            "dashboard.html";

                    },
                    800
                );

            }

            catch (erro) {

                console.error(
                    "Erro ao salvar rota:",
                    erro
                );


                mostrarMensagem(

                    erro.message ||
                    "Não foi possível salvar a rota."

                );


                if (btnSalvar) {

                    btnSalvar.disabled =
                        false;

                    btnSalvar.textContent =
                        idRota
                            ? "Salvar edição"
                            : "Salvar rota";

                }

            }

        }
    );

}


// =========================================
// INICIAR
// =========================================

carregarRota();