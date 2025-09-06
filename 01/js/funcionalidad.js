import * as js from "../plugins/invocandojs/invocandojs.es.js";

document.addEventListener("DOMContentLoaded", function () {

    window.addEventListener("load", () => {
        document.getElementById("loader").classList.add("oculto");
    });

    // --------------------- Inicializar el validador ----------------------
    const inicializarValidador = (formPaso) => {
        return new js.Validador(formPaso, "inputs", {
            cssInputError: "is-invalid",
            cssInputExito: "is-valid",
            cssMensajeError: "invalid-feedback",
            cssMensajeExito: "valid-feedback",
            asteriscos: "asterisco",
            reactivo: true,
            dataError: "data-error",
            dataPadre: "data-padre",
            dataHijo: "data-hijo",
            dataOcultarConDisplay: ["data-ocultable", true],
            dataOcultarConHidden: ["data-ocultableHidden", true],
            limpiarPresionandoCheckboxs: true,
        });
    };

    // --------------------- VALIDACIONES ----------------------------------

    const formPaso1 = inicializarValidador("Paso1");
    formPaso1
        .input("platoPrincipal", [
            [formPaso1.regla(js.Input.select.valido, "0"), "Debe seleccionar un plato principal"],
        ])
        .input("advertenciaSopa", [
            [formPaso1.regla(js.Input.checkbox.marcado), "Debe aceptar la advertencia si selecciona sopa"],
        ])
        .input("bebida", [
            [formPaso1.regla(js.Input.select.valido, "0"), "Debe seleccionar una bebida"],
        ]);

    const formPaso2 = inicializarValidador("Paso2");
    formPaso2
        .input("nombreCliente", [
            [formPaso2.regla(js.Funciones.texto.requerido), "Nombre requerido"],
        ])
        .input("tentaculos", [
            [formPaso2.regla(js.Input.select.valido, "0"), "Cantidad de tentáculos requerida"],
        ])
        .input("tipoMetabolismo", [
            [formPaso2.regla(js.Input.radio.algunoMarcado), "Debe seleccionar un tipo de metabolismo"],
        ])
        .input("metabolismoEspecificar", [
            [formPaso2.regla(js.Input.marcarGrupoSiTextoVacio, "metabolismoOtro", "is-invalid", "is-valid"), "Debe especificar otro tipo de metabolismo"],
        ])
        .input("alergico", [
            [formPaso2.regla(js.Input.radio.algunoMarcado), "Debe seleccionar si es alérgico o no"],
        ])
        .input("descripcionAlergia", [
            [formPaso2.regla(js.Input.marcarGrupoSiTextoVacio, "alergicoSi", "is-invalid", "is-valid"), "Debe especificar la alergia si es alérgico"],
            [formPaso2.regla(js.Input.text.largoMaximo, 5000, "alergicoSi", "is-invalid", "is-valid"), "No puede exceder los 5000 caracteres"],
        ]);

    const formPaso3 = inicializarValidador("Paso3");
    formPaso3
        .input("tipoPago", [
            [formPaso3.regla(js.Input.radio.algunoMarcado), "Debe seleccionar un tipo de pago"],
        ])
        .input("archivoTrueque", [
            [formPaso3.regla(js.Input.file.seleccionado), "Debe adjuntar un archivo de imagen si selecciona trueque"],
            [formPaso3.regla(js.Input.file.tipoMimeValido, ["image/png", "image/jpeg"]), "El archivo debe ser una imagen válida (.png, .jpeg, .jpg)"],
            [formPaso3.regla(js.Input.file.tamanioMaximo, 2, "MB"), "El archivo debe ser menor a 2MB"],
        ])
        .input("descripcionTrueque", [
            [formPaso3.regla(js.Input.requerido), "Debe especificar una descripción del trueque si selecciona trueque"],
            [formPaso3.regla(js.Input.text.largoMaximo, 5000), "No puede exceder los 5000 caracteres"],
        ])
        .input("terminosCondiciones", [
            [formPaso3.regla(js.Input.checkbox.marcado), "Debe aceptar los términos y condiciones"],
        ]);

    const validadores = {
        formPaso1: formPaso1,
        formPaso2: formPaso2,
        formPaso3: formPaso3
    };


    // ********* LÓGICA MANUAL PARA EL FORMULARIO **************************************

    //JS vanilla es asqueroso, jQuery es la maravilla, pero estoy aprendiendo JS vanilla
    //Forma prehistórica (loop clásico)
    const radiosMetabolismo = document.getElementsByName("tipoMetabolismo");
    for (let i = 0; i < radiosMetabolismo.length; i++) {
        radiosMetabolismo[i].addEventListener("change", function () {
            if (this.value === "Otro") {
                js.UI.visualizacion.mostrar("#metabolismoEspecificar", "block");
                document.querySelector("#metabolismoEspecificar").value = ""; // Limpiar el campo de texto al seleccionar "Otro"
            } else {
                js.UI.visualizacion.ocultar("#metabolismoEspecificar");
            }
        });
    }

    const selectPlatoPrincipal = document.querySelector("#platoPrincipal");
    const advertenciaSopa = document.querySelector("#advertenciaSopa");
    selectPlatoPrincipal.addEventListener("change", function () {
        const imagenPlato = this.options[this.selectedIndex].getAttribute("data-img");
        const descripcionPlato = this.options[this.selectedIndex].getAttribute("data-descripcion");
        const recuadroPlato = document.getElementById('imagenPlato');
        recuadroPlato.src = `./img/${imagenPlato}`;
        const pDescripcionPlato = document.getElementById('descripcionPlato');
        pDescripcionPlato.innerHTML = descripcionPlato;

        if (this.value === "1") {
            advertenciaSopa.checked = false;
            js.Formulario.resetearClasesYErrores("#contenedorAdvertenciaSopa", ["is-invalid", "is-valid"]);
            js.UI.visualizacion.mostrarQuitandoHidden("#contenedorAdvertenciaSopa", "block");
        } else {
            js.UI.visualizacion.ocultarConHidden("#contenedorAdvertenciaSopa");
        }
    });

    const selectBebida = document.querySelector("#bebida");
    selectBebida.addEventListener("change", function () {
        const bebidaSeleccionada = this.options[this.selectedIndex].getAttribute("data-img");
        const tituloBebida = this.options[this.selectedIndex].getAttribute("data-texto");
        const recuadroBebida = document.getElementById('imagenBebida');
        recuadroBebida.src = `./img/${bebidaSeleccionada}`;
        const pTituloBebida = document.getElementById('tituloBebida');
        pTituloBebida.innerHTML = tituloBebida;
    });

    const checksExtras = document.querySelectorAll("input[name='extras[]']");
    checksExtras.forEach(function (check) {
        check.addEventListener("change", function () {
            const extra = this.getAttribute("data-img");
            const tituloExtra = this.getAttribute("data-texto");
            const contenedoresExtras = document.querySelectorAll(".contenedor-extra");
            if (this.checked) {
                //Seleccionar el primer contenedoresExtras que tenta data-extra vacío
                //y asignarle el extra seleccionado
                let asignado = false;
                contenedoresExtras.forEach(function (contenedor) {
                    if (!asignado && contenedor.getAttribute("data-extra") === "") {
                        contenedor.setAttribute("data-extra", extra);
                        const tituloElemento = contenedor.querySelector(".tituloExtra");
                        tituloElemento.innerHTML = tituloExtra;
                        const imagenExtra = contenedor.querySelector(".imagenExtra");
                        imagenExtra.src = `./img/${extra}`;
                        asignado = true;
                    }
                });
            } else {
                // Remover el extra del primer contenedor que tenga el mismo data-extra
                let removido = false;
                contenedoresExtras.forEach(function (contenedor) {
                    if (!removido && contenedor.getAttribute("data-extra") === extra) {
                        contenedor.setAttribute("data-extra", "");
                        const tituloElemento = contenedor.querySelector(".tituloExtra");
                        tituloElemento.innerHTML = "";
                        const imagenExtra = contenedor.querySelector(".imagenExtra");
                        imagenExtra.src = "./img/pendiente_mini.webp";
                        removido = true;
                    }
                });
            }

            //Si hay un contenedoresExtras vacío antes del contenedoresExtras siguiente con datos, el siguiente con datos debe colocarse en el vacío
            for (let i = 0; i < contenedoresExtras.length - 1; i++) {
                if (contenedoresExtras[i].getAttribute("data-extra") === "" && contenedoresExtras[i + 1].getAttribute("data-extra") !== "") {
                    contenedoresExtras[i].setAttribute("data-extra", contenedoresExtras[i + 1].getAttribute("data-extra"));
                    const tituloElemento = contenedoresExtras[i].querySelector(".tituloExtra");
                    tituloElemento.innerHTML = contenedoresExtras[i + 1].querySelector(".tituloExtra").innerHTML;
                    const imagenExtra = contenedoresExtras[i].querySelector(".imagenExtra");
                    imagenExtra.src = contenedoresExtras[i + 1].querySelector(".imagenExtra").src;

                    // Limpiar el siguiente contenedor
                    contenedoresExtras[i + 1].setAttribute("data-extra", "");
                    const tituloSiguiente = contenedoresExtras[i + 1].querySelector(".tituloExtra");
                    tituloSiguiente.innerHTML = "";
                    const imagenSiguiente = contenedoresExtras[i + 1].querySelector(".imagenExtra");
                    imagenSiguiente.src = "./img/pendiente_mini.webp";
                }
            }
        });
    });

    // Forma moderna (forEach)
    // Esto es más limpio y fácil de leer, pero no es compatible con IE11
    const radiosAlergico = document.querySelectorAll('input[name="alergico"]');
    radiosAlergico.forEach(function (radio) {
        radio.addEventListener("change", function (event) {
            const alergicoEspecificar = document.querySelector("#descripcionAlergia");
            if (event.target.value === "si") {
                js.Formulario.desbloquearInputs("#descripcionAlergia");
                alergicoEspecificar.required = true; // Hacer el campo requerido
            } else {
                js.Formulario.bloquearInputs("#descripcionAlergia");
                alergicoEspecificar.required = false; // Quitar el requisito
                alergicoEspecificar.value = ""; // Limpiar el campo de texto
            }
        });
    });

    const radiosTipoPago = document.querySelectorAll('input[name="tipoPago"]');
    radiosTipoPago.forEach(function (radio) {
        radio.addEventListener("change", function (event) {
            const inputArchivo = document.querySelector("#archivoTrueque");
            const descripcionTrueque = document.querySelector("#descripcionTrueque");
            if (radio.id === "trueque") {
                js.UI.visualizacion.mostrar("#archivoTrueque", "block");
                js.UI.visualizacion.mostrar("#descripcionTrueque", "block");
            } else {
                js.UI.visualizacion.ocultar("#archivoTrueque");
                inputArchivo.required = false;
                inputArchivo.value = "";
                js.UI.visualizacion.ocultar("#descripcionTrueque");
                descripcionTrueque.required = false;
                descripcionTrueque.value = "";
            }
        });
    });


    document.getElementById('archivoTrueque').addEventListener('change', function () {
        const archivo = this.files[0];
        const preview = document.getElementById('resumenObjetoTrueque');

        if (archivo && archivo.type.startsWith('image/')) {
            const lector = new FileReader();
            lector.onload = function (e) {
                preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100px; border-radius: 8px;">`;
            };
            lector.readAsDataURL(archivo);
        } else {
            preview.innerHTML = '<p>No se seleccionó una imagen válida.</p>';
        }
    });
    // ********* FIN DE LÓGICA MANUAL PARA EL FORMULARIO **************************************


    /**
     * BOTONES
     */
    const btnLimpiar = document.getElementById("limpiar-form");
    const btnVolver = document.getElementById("volver-form");
    const btnAvanzar = document.getElementById("avanzar-form");
    const btnPagar = document.getElementById("enviar-form");

    // Eventos de botones
    btnLimpiar.addEventListener("click", function (e) {
        const grupoActual = document.querySelector('#formulario fieldset.active');
        limpiar(grupoActual);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    btnVolver.addEventListener("click", function (e) {
        const grupoActual = document.querySelector('#formulario fieldset.active');
        const grupoAnterior = grupoActual.previousElementSibling;

        if (grupoAnterior !== null) retroceder(grupoActual, grupoAnterior);

        if (grupoAnterior.id === "Paso1") btnVolver.disabled = true;
        else btnVolver.disabled = false;

        visibilidadExtras("retrocediendo", grupoAnterior.id);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const visibilidadExtras = (modo, paso) => {
        const contenedorExtras = document.querySelectorAll(".contenedor-extra");
        if (contenedorExtras.length > 0) {
            contenedorExtras.forEach(contenedor => {
                if (modo === "avanzando") {
                    if (contenedor.getAttribute("data-extra") !== "") {
                        js.UI.visualizacion.mostrar(contenedor, "block");
                    } else {
                        js.UI.visualizacion.ocultar(contenedor);
                    }
                } else if (modo === "retrocediendo" && paso === "Paso1") {
                    js.UI.visualizacion.mostrar(contenedor, "block");
                }
            });
        }
    }

    btnAvanzar.addEventListener("click", function (e) {
        validarPaso();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    btnPagar.addEventListener("click", async function (e) {
        const datos = await obtenerDatosDeUsuario();

        mostrarModalError(`
                            Hoy hemos recibido demasiadas solicitudes en el restorant galáctico.
                            Un usuario conectado desde la IP <b>${datos.ip}</b>, <b>${datos.ciudad}</b>, <b>${datos.pais}</b>, usando <b>${datos.navegador} ${datos.version}</b> en <b>${datos.so} ${datos.dispositivo}</b>,
                            provocó una distorsión espacio-temporal y colapsó el sistema 🍝💥.
                            <br><br>
                            Por favor, intente de nuevo en la siguiente conjunción planetaria. ✨
                        `);
    });

    const mostrarModalError = (mensaje) => {
        const errorSound = new Audio('./sounds/error.mp3');
        errorSound.play();

        Swal.fire({
            title: '👽 Lamentamos las molestias.',
            html: mensaje,
            background: '#08111a',
            color: '#f0f0f0',
            confirmButtonText: 'Entendido 🛸',
            confirmButtonColor: '#a855f7',
            imageUrl: './img/error_mini.webp',
            imageWidth: 100,
            imageHeight: 100,
            customClass: {
                popup: 'swal2-galaxia',
                title: 'swal2-titulo-espacial',
                htmlContainer: 'swal2-html-espacial',
                confirmButton: 'swal2-boton-neon'
            },
            showClass: {
                popup: `
                        animate__animated
                        animate__jello
                        animate__fast
                        `
            },
            hideClass: {
                popup: `
                        animate__animated
                        animate__hinge
                        animate__normal
                        `
            }
        });
    }


    ////////// FUNCIONES VINCULADAS A LOS BOTONES //////////
    const obtenerFormPaso = () => {
        return "form" + document.querySelector('#formulario').getAttribute("data-formpaso");
    }
    const actualizarFormPaso = (grupoActual) => {
        document.querySelector("#formulario").setAttribute("data-formpaso", grupoActual);
    }

    const validarPaso = () => {
        const grupoActual = seleccionarGrupoForm();
        if (grupoActual !== null) {
            const grupoSiguiente = grupoActual.nextElementSibling;
            const formPaso = validadores[obtenerFormPaso()];

            if (formPaso.valida()) {
                avanzar(grupoActual, grupoSiguiente);
            } else {
                //formPaso.mostrarErrores(); Lo dejo comentado. En caso de querer mostrar errores de otra forma, habría que descomentar
            }
        } else {
            alert("No hay un formulario activo para validar.");
        }
    }

    const seleccionarGrupoForm = () => {
        if (document.querySelector('#formulario fieldset.active')) return document.querySelector('#formulario fieldset.active');
        else return null;
    }

    const mostrarBtnLimpiar = (mostrar) => {
        if (mostrar) btnLimpiar.hidden = false;
        else btnLimpiar.hidden = true;
    }

    const limpiar = (grupoActual) => {
        const formPaso = validadores[obtenerFormPaso()];
        formPaso.reset();

        if (grupoActual.id === "Paso1") {
            const recuadrosComida = document.querySelectorAll(".imagen-comida");
            recuadrosComida.forEach(recuadro => {
                recuadro.src = "./img/pendiente_mini.webp"; // Cambia la imagen del recuadro a un placeholder
            });

            const pTituloBebida = document.getElementById('tituloBebida');
            pTituloBebida.innerHTML = "";

            const pDescripcionPlato = document.getElementById('descripcionPlato');
            pDescripcionPlato.innerHTML = "";

            const contenedorExtras = document.querySelectorAll(".contenedor-extra");
            const ptitulosExtras = document.querySelectorAll('.tituloExtra');
            ptitulosExtras.forEach(titulo => {
                titulo.innerHTML = "";
                contenedorExtras.forEach(contenedor => {
                    contenedor.setAttribute("data-extra", "");
                });
            });
        }
    }

    const retroceder = (grupoActual, grupoAnterior) => {
        grupoAnterior.classList.replace("oculto", "active");
        grupoActual.classList.replace("active", "oculto");

        let mostrar = mostrarBtnAvanzar("retrocediendo", grupoActual.id);
        mostrarBtnLimpiar(mostrar);
        actualizarFormPaso(grupoAnterior.id);
    }

    const avanzar = (grupoActual, grupoSiguiente) => {
        grupoSiguiente.classList.replace("oculto", "active");
        grupoActual.classList.replace("active", "oculto");

        btnVolver.disabled = false;
        const mostrarBtn = mostrarBtnAvanzar("avanzando", grupoActual.id);
        const imprimirResumen = (mostrarBtn === true) ? false : true;
        mostrarBtnLimpiar(mostrarBtn);
        resumenPedido(imprimirResumen);
        visibilidadExtras("avanzando");
        actualizarFormPaso(grupoSiguiente.id);
    }

    const mostrarBtnAvanzar = (forma, idGrupoActual) => {
        if ((forma === "avanzando" && idGrupoActual === "Paso3")) {
            btnAvanzar.hidden = true;
            btnPagar.hidden = false;
            return false;
        } else {
            btnAvanzar.hidden = false;
            btnPagar.hidden = true;
            return true;
        }
    }

    const resumenPedido = (imprimir) => {
        const contenedorResumen = document.querySelector("#resumenPedido");
        if (imprimir) {
            //Nombre del Cliente
            const nombreCliente = document.querySelector("#nombreCliente");
            document.querySelector("#resumenNombreCliente").innerHTML = nombreCliente.value;
            //Tentáculos
            const tentaculos = document.querySelector("#tentaculos");
            document.querySelector("#resumenTentaculos").innerHTML = tentaculos.value;
            //Metabolismo
            const metabolismoInput = document.querySelector('input[name="tipoMetabolismo"]:checked');
            const metabolismo = metabolismoInput ? metabolismoInput.value : "No especificado";
            document.querySelector("#resumenMetabolismo").innerHTML = metabolismo;
            // Descripción de metabolismo específico tipoMetabolismo
            const metabolismoEspecificar = document.querySelector("#metabolismoEspecificar");
            const resumenDescripcionMetabolismo = document.querySelector("#resumenDescripcionMetabolismo");
            const trMetabolismoOtro = resumenDescripcionMetabolismo.parentElement;
            if (metabolismoInput && metabolismoInput.value === "Otro") {
                resumenDescripcionMetabolismo.innerHTML = metabolismoEspecificar.value;
                trMetabolismoOtro.style.display = "table-row";
            } else {
                resumenDescripcionMetabolismo.innerHTML = "";
                trMetabolismoOtro.style.display = "none";
            }
            //Alergias
            const alergias = document.querySelector('input[name="alergico"]:checked');
            document.querySelector("#resumenAlergias").innerHTML = alergias.dataset.texto;
            //Descripción de alergia
            const descripcionAlergia = document.querySelector("#descripcionAlergia");
            const trDescripcionAlergia = document.querySelector("#resumenDescripcionAlergias").parentElement;
            document.querySelector("#resumenDescripcionAlergias").innerHTML = descripcionAlergia.value;
            if (alergias.value === "si") trDescripcionAlergia.style.display = "table-row";
            else trDescripcionAlergia.style.display = "none";

            //************************************************** */

            //Plato principal
            const plato = document.querySelector('select[name="platoPrincipal"] option:checked');
            document.querySelector("#resumenPlato").innerHTML = plato.dataset.texto;
            document.querySelector("#resumenPlatoCosto").innerHTML = "$" + plato.dataset.precio;
            //Bebida
            const bebida = document.querySelector('select[name="bebida"] option:checked');
            document.querySelector("#resumenBebida").innerHTML = bebida.dataset.texto;
            document.querySelector("#resumenBebidaCosto").innerHTML = "$" + bebida.dataset.precio;
            //Extras
            const extras = Array.from(document.querySelectorAll("input[name='extras[]']:checked"));
            //Extra 1
            const trResumenExtra1 = document.querySelector("#resumenExtra1").parentElement;
            if (extras[0]) {
                document.querySelector("#resumenExtra1").innerHTML = extras[0].dataset.texto;
                document.querySelector("#resumenExtra1Costo").innerHTML = "$" + extras[0].dataset.precio;
                trResumenExtra1.style.display = "table-row";
            } else {
                document.querySelector("#resumenExtra1").innerHTML = "";
                document.querySelector("#resumenExtra1Costo").innerHTML = "";
                trResumenExtra1.style.display = "none";
            }

            //Extra 2
            const trResumenExtra2 = document.querySelector("#resumenExtra2").parentElement;
            if (extras[1]) {
                document.querySelector("#resumenExtra2").innerHTML = extras[1].dataset.texto;
                document.querySelector("#resumenExtra2Costo").innerHTML = "$" + extras[1].dataset.precio;
                trResumenExtra2.style.display = "table-row";
            } else {
                document.querySelector("#resumenExtra2").innerHTML = "";
                document.querySelector("#resumenExtra2Costo").innerHTML = "";
                trResumenExtra2.style.display = "none";
            }

            //Extra 3
            const trResumenExtra3 = document.querySelector("#resumenExtra3").parentElement;
            if (extras[2]) {
                document.querySelector("#resumenExtra3").innerHTML = extras[2].dataset.texto;
                document.querySelector("#resumenExtra3Costo").innerHTML = "$" + extras[2].dataset.precio;
                trResumenExtra3.style.display = "table-row";
            } else {
                document.querySelector("#resumenExtra3").innerHTML = "";
                document.querySelector("#resumenExtra3Costo").innerHTML = "";
                trResumenExtra3.style.display = "none";
            }

            //TOTAL
            const total = parseFloat(plato.dataset.precio) + parseFloat(bebida.dataset.precio) +
                (extras[0] ? parseFloat(extras[0].dataset.precio) : 0) +
                (extras[1] ? parseFloat(extras[1].dataset.precio) : 0) +
                (extras[2] ? parseFloat(extras[2].dataset.precio) : 0);
            document.querySelector("#resumenTotal").innerHTML = "$" + total;


            //Método de pago
            const metodoPagoInput = document.querySelector('input[name="tipoPago"]:checked');
            const metodoPago = metodoPagoInput ? metodoPagoInput.dataset.texto : "No especificado";
            document.querySelector("#resumenMedioPago").innerHTML = metodoPago;
            //Imagen de archivo de trueque
            const archivoTrueque = document.querySelector("#archivoTrueque");
            //Desripción del archivo de trueque
            const descripcionTrueque = document.querySelector("#descripcionTrueque");

            const resumenObjetoTrueque = document.querySelector("#resumenObjetoTrueque");
            const trResumenObjetoTrueque = resumenObjetoTrueque.parentElement;
            const resumenDescripcionObjeto = document.querySelector("#resumenDescripcionObjeto");
            const trResumenDescripcionObjeto = resumenDescripcionObjeto.parentElement;

            if (metodoPago === "Trueque") {
                //Se muestran las filas para la tabla
                trResumenObjetoTrueque.style.display = "table-row";
                trResumenDescripcionObjeto.style.display = "table-row";
                //(La imagen del objeto de trueque ya se cargó al subirse)
                //Se carga el texto de descripción del trueque
                resumenDescripcionObjeto.innerHTML = descripcionTrueque.value;
            } else {
                //Se ocultan las filas para la tabla
                trResumenObjetoTrueque.style.display = "none";
                trResumenDescripcionObjeto.style.display = "none";
                //Se limpian los contenidos de la imagen y descripción del trueque
                resumenObjetoTrueque.innerHTML = "";
                resumenDescripcionObjeto.innerHTML = "";
            }
        } else {
            js.UI.visualizacion.ocultar(contenedorResumen);
        }
    }

    async function obtenerDatosDeUsuario() {
        let ipData = {};

        try {
            const res = await fetch('https://ipapi.co/json/');
            ipData = await res.json();
        } catch (error) {
            // Si falla el fetch o el .json(), usamos datos falsos
            ipData.ip = "192.158.4.206";
            ipData.country_name = "Plutón";
            ipData.city = "Neón City";
        }
        return {
            ip: ipData.ip,
            pais: ipData.country_name,
            ciudad: ipData.city,
            navegador: js.UI.navegador.nombre(),
            version: js.UI.navegador.version(),
            so: js.UI.dispositivo.sistemaOperativo(),
            dispositivo: js.UI.dispositivo.esMovil() ? "móvil" : "de escritorio"
        };
    }
});
// Este archivo contiene todas las formas en que me peleé con JS.
// Elige tu veneno y sigue adelante.