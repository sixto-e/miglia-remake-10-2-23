var express = require('express');
var router = express.Router();

const { listado_de_provincias, verificar_si_el_cuit_del_cliente_ya_existe, semaforos, single_cliente, borrar_cliente, obtener_provincia_por_id, obtener_semaforo_por_id, editar_cliente } = require("../../models/consulta");
const { validar_carga_cliente } = require("../../middlewares/carga_cliente")


const obtener_semaforo_comerc_y_prov = async (datos) => {

    const id_prov = datos[0]["provincia"]

    const id_semaf = datos[0]["semaforo_comercial"]

    const provincia_obtenida = await obtener_provincia_por_id(id_prov);
    // console.log("provincia_obtenida: ", provincia_obtenida);

    const semaf_comerc_obtenido = await obtener_semaforo_por_id(id_semaf);
    // console.log("semaf_comerc_obtenido: ", semaf_comerc_obtenido);

    return {
        provincia_obtenida,
        semaf_comerc_obtenido
    }
}



const single_cliente_habilitado = async (req, res) => {

    // Cuit del cliente cuando lo editamos
    global.cuit_cliente_edicion_datos

    // Declaración de variables
    var fk_data, prov, semaforo_c;
    // Listado de provincias
    const provincias = await listado_de_provincias();
    // Listado de semáfros comerciales
    const semafs = await semaforos()
    // ID del cliente
    const id = req.params.id;
    // Estado de cliente - habilitado
    const estado = true;
    // Datos del cliente single habilitado
    const datos = await single_cliente(id, estado);
    // console.log("datos: ", datos);
    // Hay datos del cliente
    if (datos.length > 0) {
        cuit_cliente_edicion_datos = datos[0]["cuit"];
        // console.log("cuit_cliente_edicion_datos: ", cuit_cliente_edicion_datos);
        // Obtendo el id y la descrip de la prov y el semaf
        fk_data = await obtener_semaforo_comerc_y_prov(datos);
        // console.log("fk_data: ", fk_data);
         
    }
    if (fk_data.provincia_obtenida.length > 0 || fk_data.semaf_comerc_obtenido.length) {
        prov = fk_data.provincia_obtenida[0];
        // console.log("prov: ", prov);
        semaforo_c = fk_data.semaf_comerc_obtenido[0];
        // console.log("semaforo_c: ", semaforo_c);
    }


    res.render("CLIENTES/cliente_single", { provincias, semafs, datos, estado, prov, semaforo_c })
}

router.get("/:id", single_cliente_habilitado);


const single_cliente_borrado = async (req, res) => {

    // Declaración de variables
    var fk_data, prov, semaforo_c;
    // Listado de provincias
    const provincias = await listado_de_provincias();
    // Listado de semáfros comerciales
    const semafs = await semaforos()
    // ID del cliente
    const id = req.params.id;
    // Estado de cliente - no habilitado
    const estado = false;
    // Datos del cliente single borrado
    const datos = await single_cliente(id, estado);
    //console.log("datos cliente borrado: ", datos);
    if (datos.length > 0) {
        // Obtendo el id y la descrip de la prov y el semaf
        fk_data = await obtener_semaforo_comerc_y_prov(datos);
        // console.log("fk_data: ", fk_data);
    }
    if (fk_data.provincia_obtenida.length > 0 || fk_data.semaf_comerc_obtenido.length) {
        prov = fk_data.provincia_obtenida[0];
        // console.log("prov: ", prov);
        semaforo_c = fk_data.semaf_comerc_obtenido[0];
        // console.log("semaforo_c: ", semaforo_c);
    }

    res.render("CLIENTES/cliente_single", { provincias, semafs, datos, estado, prov, semaforo_c })
}

router.get("/borrado/:id", single_cliente_borrado);

const editar_cliente_single_habilitado = async (req, res) => {
    // Declaración de variables
    var id_cliente, nueva_data, cuit_editado, cuit_cliente_antes_de_ser_editado, cliente_editado

    // ID del cliente
    id_cliente = req.params.id;
    // console.log("id_cliente: ", id_cliente);
    // Cambios
    nueva_data = req.body;
    // console.log("nueva_data: ", nueva_data);
    // CUIT cliente antes de la edición - Obtenido desde la base de datos
    cuit_cliente_antes_de_ser_editado = cuit_cliente_edicion_datos;
    // console.log("cuit_cliente_antes_de_ser_editado: ", cuit_cliente_antes_de_ser_editado);
    // CUIT cliente EDITADO - Obtenido del FORM de edición
    cuit_editado = req.body.cuit;
    // console.log("cuit_editado: ", cuit_editado);


    //  NO CAMBIA EL CUIT. SON IGUALES. NO LO EDITÓ. NO HAY RIESGOS DE DUPLICIDAD YA QUE EL CUIT ES PARA EL MISMO CLIENTE
    if (cuit_cliente_antes_de_ser_editado === cuit_editado) {
        // console.log("¿ ", cuit_cliente_antes_de_ser_editado, " y ", cuit_editado, "Son iguales ?");
        // console.log("(TRUE): Permito edición | (FALSE): No permito la edición | Resultado", cuit_cliente_antes_de_ser_editado === cuit_editado);
        // console.log();
        // console.log("Conclusión: Como no se cambió el cuit permito la edición ya que no habrá duplicidad en la base de datos");
        // CAMBIE EL CUIT POR UNO NUEVO
        cliente_editado = await editar_cliente(nueva_data, id_cliente)
        // console.log("cliente_editado: ", cliente_editado);
        res.redirect("/cliente/" + id_cliente);

    } else {
        // console.log("¿ ", cuit_cliente_antes_de_ser_editado, " y ", cuit_editado, "Son iguales ?");
        // console.log("(TRUE): Permito edición | (FALSE): No permito la edición | Resultado:", cuit_cliente_antes_de_ser_editado === cuit_editado);
        // console.log();
        // console.log("Conclusión: Como se cambió el cuit, para permitir la carga primero debo verificar que no se repita con otro ya existente en la base de datos");

        // Comparo todos con el el cuit editado
        const resultado = await verificar_si_el_cuit_del_cliente_ya_existe(cuit_editado)

        // EL CUIT PERTENECE A OTRO CLIENTE: NO PERMITO EDICIÓN
        if (resultado.length > 0) {
            res.send("El cuit ingresado pertenece a otro cliente");

            // EL CUIT ES NUEVO EN LA BASE DE DATOS: PERMITO EDICIÓN
        } else {
            cliente_editado = await editar_cliente(nueva_data, id_cliente)
            // console.log("cliente_editado: ", cliente_editado);
            res.redirect("/cliente/" + id_cliente);
        }


    }

}

router.post("/:id/create", validar_carga_cliente, editar_cliente_single_habilitado)



const borrar_cliente_ = async (req, res) => {

    // Obtengo el id del cliente a eliminar
    const id = req.params.id;
    // Estado en false
    const estado = false;
    // Elimino el cliente
    const cliente_borrado = await borrar_cliente(estado, id);
    // console.log("cliente_borrado: ", cliente_borrado);
    // Redirecciona a clientes habilitados
    res.redirect("/clientes")

}

router.get("/borrar/:id", borrar_cliente_);


const activar_cliente = async (req, res) => {

    // Obtengo el id del cliente a activar
    const id = req.params.id;

    // Estado en true
    const estado = true;

    const cliente_activado = await borrar_cliente(estado, id);
    // console.log("cliente_activado: ", cliente_activado);

    // Redirecciona a clientes habilitados
    res.redirect("/clientes")

}

router.get("/habilitar/:id", activar_cliente);




module.exports = router;
