$(document).ready(function () {

    /* =====================================================
       ALKE WALLET - SCRIPT PRINCIPAL
       HTML + CSS + JavaScript + Bootstrap + jQuery
    ===================================================== */

    /* =========================
       CONFIGURACIÓN INICIAL
    ========================= */

    function inicializarDatos() {

        if (localStorage.getItem("saldo") === null) {
            localStorage.setItem("saldo", "250000");
        }

        if (localStorage.getItem("contactos") === null) {

            const contactosIniciales = [
                {
                    nombre: "Juan Pérez",
                    cbu: "123456789",
                    alias: "jperez",
                    banco: "Banco Estado"
                },
                {
                    nombre: "María López",
                    cbu: "987654321",
                    alias: "mlopez",
                    banco: "Banco Chile"
                },
                {
                    nombre: "Carlos Soto",
                    cbu: "456789123",
                    alias: "csoto",
                    banco: "Banco Santander"
                }
            ];

            localStorage.setItem(
                "contactos",
                JSON.stringify(contactosIniciales)
            );
        }

        if (localStorage.getItem("movimientos") === null) {

            const movimientosIniciales = [
                {
                    tipo: "deposito",
                    descripcion: "Depósito inicial",
                    monto: 250000,
                    fecha: obtenerFechaActual()
                }
            ];

            localStorage.setItem(
                "movimientos",
                JSON.stringify(movimientosIniciales)
            );
        }
    }

    inicializarDatos();

    /* =========================
       FUNCIONES GENERALES
    ========================= */

    function obtenerFechaActual() {
        const fecha = new Date();

        return fecha.toLocaleDateString("es-CL");
    }

    function obtenerSaldo() {
        return Number(localStorage.getItem("saldo")) || 0;
    }

    function guardarSaldo(nuevoSaldo) {
        localStorage.setItem("saldo", String(nuevoSaldo));
    }

    function formatoMonto(monto) {
        return "$" + Number(monto).toLocaleString("es-CL");
    }

    function mostrarAlerta(selector, tipo, mensaje) {
        $(selector).html(
            "<div class='alert alert-" + tipo + " mt-3'>" +
            mensaje +
            "</div>"
        );
    }

    function guardarMovimiento(tipo, descripcion, monto) {

        let movimientos =
            JSON.parse(localStorage.getItem("movimientos")) || [];

        movimientos.push({
            tipo: tipo,
            descripcion: descripcion,
            monto: Number(monto),
            fecha: obtenerFechaActual()
        });

        localStorage.setItem(
            "movimientos",
            JSON.stringify(movimientos)
        );
    }

    function actualizarSaldosEnPantalla() {

        const saldo = obtenerSaldo();

        if ($("#saldoMenu").length > 0) {
            $("#saldoMenu").text(formatoMonto(saldo));
        }

        if ($("#saldoActualDeposito").length > 0) {
            $("#saldoActualDeposito").text(formatoMonto(saldo));
        }
    }

    actualizarSaldosEnPantalla();

    /* =========================
       LOGIN
    ========================= */

    $("#loginForm").submit(function (e) {

        e.preventDefault();

        const email = $("#email").val().trim();
        const password = $("#password").val().trim();

        if (email === "" || password === "") {

            mostrarAlerta(
                "#mensajeLogin",
                "danger",
                "Debe completar todos los campos."
            );

            return;
        }

        if (
            email === "paola@wallet.com" &&
            password === "1234"
        ) {

            mostrarAlerta(
                "#mensajeLogin",
                "success",
                "Inicio de sesión exitoso. Redirigiendo al menú principal..."
            );

            setTimeout(function () {
                window.location.href = "menu.html";
            }, 1500);

        } else {

            mostrarAlerta(
                "#mensajeLogin",
                "danger",
                "Correo o contraseña incorrectos."
            );
        }
    });

    /* =========================
       MENÚ PRINCIPAL
    ========================= */

    $("#btnDepositar").click(function () {

        mostrarAlerta(
            "#mensajeMenu",
            "info",
            "Redirigiendo a depósito..."
        );

        setTimeout(function () {
            window.location.href = "deposit.html";
        }, 1000);
    });

    $("#btnEnviar").click(function () {

        mostrarAlerta(
            "#mensajeMenu",
            "warning",
            "Redirigiendo a enviar dinero..."
        );

        setTimeout(function () {
            window.location.href = "sendmoney.html";
        }, 1000);
    });

    $("#btnMovimientos").click(function () {

        mostrarAlerta(
            "#mensajeMenu",
            "info",
            "Redirigiendo a últimos movimientos..."
        );

        setTimeout(function () {
            window.location.href = "transactions.html";
        }, 1000);
    });

    /* =========================
       DEPÓSITOS
    ========================= */

    $("#depositForm").submit(function (e) {

        e.preventDefault();

        const monto = Number($("#montoDeposito").val());

        if (monto <= 0 || isNaN(monto)) {

            mostrarAlerta(
                "#alert-container",
                "danger",
                "Debe ingresar un monto válido."
            );

            return;
        }

        let saldo = obtenerSaldo();

        saldo = saldo + monto;

        guardarSaldo(saldo);

        guardarMovimiento(
            "deposito",
            "Depósito realizado",
            monto
        );

        $("#montoDepositado").html(
            "<div class='alert alert-secondary mt-3'>" +
            "Monto depositado: <strong>" +
            formatoMonto(monto) +
            "</strong></div>"
        );

        mostrarAlerta(
            "#alert-container",
            "success",
            "Depósito realizado correctamente. Nuevo saldo: <strong>" +
            formatoMonto(saldo) +
            "</strong>"
        );

        $("#montoDeposito").val("");

        actualizarSaldosEnPantalla();

        setTimeout(function () {
            window.location.href = "menu.html";
        }, 2000);
    });

    /* =========================
       CONTACTOS
    ========================= */

    function obtenerContactos() {
        return JSON.parse(localStorage.getItem("contactos")) || [];
    }

    function guardarContactos(contactos) {
        localStorage.setItem(
            "contactos",
            JSON.stringify(contactos)
        );
    }

    function cargarContactos(lista) {

        if ($("#contactos").length === 0) {
            return;
        }

        const contactos = lista || obtenerContactos();

        $("#contactos").html(
            "<option value=''>Seleccione un contacto</option>"
        );

        contactos.forEach(function (contacto) {

            $("#contactos").append(
                "<option value='" + contacto.nombre + "'>" +
                contacto.nombre +
                " - " +
                contacto.alias +
                " (" +
                contacto.banco +
                ")" +
                "</option>"
            );
        });
    }

    cargarContactos();

    $("#btnMostrarFormulario").click(function () {

        $("#formContacto").slideDown();
        $("#mensajeEnvio").html("");
    });

    $("#btnCancelar").click(function () {

        $("#contactForm")[0].reset();
        $("#formContacto").slideUp();
        $("#mensajeEnvio").html("");
    });

    $("#contactForm").submit(function (e) {

        e.preventDefault();

        const nombre = $("#nombreContacto").val().trim();
        const cbu = $("#cbuContacto").val().trim();
        const alias = $("#aliasContacto").val().trim();
        const banco = $("#bancoContacto").val().trim();

        if (
            nombre === "" ||
            cbu === "" ||
            alias === "" ||
            banco === ""
        ) {

            mostrarAlerta(
                "#mensajeEnvio",
                "danger",
                "Debe completar todos los campos del contacto."
            );

            return;
        }

        if (isNaN(cbu) || cbu.length < 6) {

            mostrarAlerta(
                "#mensajeEnvio",
                "danger",
                "El CBU debe contener solo números y tener al menos 6 dígitos."
            );

            return;
        }

        let contactos = obtenerContactos();

        contactos.push({
            nombre: nombre,
            cbu: cbu,
            alias: alias,
            banco: banco
        });

        guardarContactos(contactos);

        cargarContactos();

        mostrarAlerta(
            "#mensajeEnvio",
            "success",
            "Contacto agregado correctamente."
        );

        $("#contactForm")[0].reset();
        $("#formContacto").slideUp();
        $("#buscarContacto").val("");
        $("#btnEnviarDinero").hide();
    });

    /* =========================
       BÚSQUEDA DE CONTACTOS
    ========================= */

    $("#buscarForm").submit(function (e) {

        e.preventDefault();

        const texto = $("#buscarContacto").val().trim().toLowerCase();

        const contactos = obtenerContactos();

        if (texto === "") {

            cargarContactos();

            mostrarAlerta(
                "#mensajeEnvio",
                "info",
                "Se muestran todos los contactos."
            );

            $("#btnEnviarDinero").hide();

            return;
        }

        const contactosFiltrados = contactos.filter(function (contacto) {

            return (
                contacto.nombre.toLowerCase().includes(texto) ||
                contacto.alias.toLowerCase().includes(texto) ||
                contacto.banco.toLowerCase().includes(texto)
            );
        });

        cargarContactos(contactosFiltrados);

        if (contactosFiltrados.length === 0) {

            mostrarAlerta(
                "#mensajeEnvio",
                "warning",
                "No se encontraron contactos."
            );

        } else {

            mostrarAlerta(
                "#mensajeEnvio",
                "success",
                "Contactos encontrados."
            );
        }

        $("#btnEnviarDinero").hide();
    });

    $("#contactos").change(function () {

        if ($(this).val() !== "") {
            $("#btnEnviarDinero").fadeIn();
        } else {
            $("#btnEnviarDinero").fadeOut();
        }
    });

    /* =========================
       ENVÍO DE DINERO
    ========================= */

    $("#btnEnviarDinero").click(function () {

        const contacto = $("#contactos").val();
        const monto = Number($("#montoEnvio").val());

        if (contacto === "") {

            mostrarAlerta(
                "#mensajeEnvio",
                "danger",
                "Debe seleccionar un contacto."
            );

            return;
        }

        if (monto <= 0 || isNaN(monto)) {

            mostrarAlerta(
                "#mensajeEnvio",
                "danger",
                "Debe ingresar un monto válido."
            );

            return;
        }

        let saldo = obtenerSaldo();

        if (monto > saldo) {

            mostrarAlerta(
                "#mensajeEnvio",
                "danger",
                "Saldo insuficiente para realizar la transferencia."
            );

            return;
        }

        saldo = saldo - monto;

        guardarSaldo(saldo);

        guardarMovimiento(
            "transferencia",
            "Envío de dinero a " + contacto,
            monto
        );

        mostrarAlerta(
            "#mensajeEnvio",
            "success",
            "Transferencia realizada correctamente a " +
            contacto +
            " por " +
            formatoMonto(monto) +
            "."
        );

        $("#contactos").val("");
        $("#montoEnvio").val("");
        $("#buscarContacto").val("");
        $("#btnEnviarDinero").fadeOut();

        cargarContactos();
        actualizarSaldosEnPantalla();
    });

    /* =========================
       ÚLTIMOS MOVIMIENTOS
    ========================= */

    function getTipoTransaccion(tipo) {

        if (tipo === "deposito") {
            return "Depósito";
        }

        if (tipo === "transferencia") {
            return "Transferencia";
        }

        if (tipo === "compra") {
            return "Compra";
        }

        return "Movimiento";
    }

    function mostrarUltimosMovimientos(filtro) {

        if ($("#listaMovimientos").length === 0) {
            return;
        }

        const movimientos =
            JSON.parse(localStorage.getItem("movimientos")) || [];

        $("#listaMovimientos").html("");

        movimientos.forEach(function (movimiento) {

            if (
                !movimiento ||
                !movimiento.tipo ||
                !movimiento.descripcion ||
                movimiento.monto === undefined ||
                isNaN(Number(movimiento.monto))
            ) {
                return;
            }

            if (
                filtro === "todos" ||
                filtro === movimiento.tipo
            ) {

                $("#listaMovimientos").append(
                    "<li class='list-group-item'>" +
                    "<strong>" +
                    getTipoTransaccion(movimiento.tipo) +
                    "</strong><br>" +
                    movimiento.descripcion +
                    "<br>" +
                    "Monto: " +
                    formatoMonto(movimiento.monto) +
                    "<br>" +
                    "<small>Fecha: " +
                    movimiento.fecha +
                    "</small>" +
                    "</li>"
                );
            }
        });

        if ($("#listaMovimientos").html() === "") {

            $("#listaMovimientos").html(
                "<li class='list-group-item text-center'>" +
                "No existen movimientos para este filtro." +
                "</li>"
            );
        }
    }

    $("#filtroMovimientos").change(function () {

        const filtro = $(this).val();

        mostrarUltimosMovimientos(filtro);
    });

    mostrarUltimosMovimientos("todos");

});

const hoy = new Date();

$("#fechaActual").text(
    hoy.toLocaleDateString("es-CL")
);