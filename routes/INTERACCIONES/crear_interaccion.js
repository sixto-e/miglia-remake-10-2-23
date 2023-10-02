var express = require('express');
var router = express.Router();

const { obtener_semaforo_por_id, obtener_provincia_por_id, seleccionar_estados_de_interaccion, crear_interaccion, seleccionar_estado, listado_tipo_maquinarias, listar_usuarios, selecciones_de_interes, crear_cliente, obtener_id_del_cliente_usando_cuit, seleccionar_clientes_habilitados, data_cliente_para_interaccion, listado_de_provincias, semaforos, verificar_si_el_cuit_del_cliente_ya_existe } = require("../../models/consulta");

const { validar_carga_cliente } = require("../../middlewares/carga_cliente")

// Borra los datos del form de un cliente buscado con el autocompletado
const borrar_datos_del_cliente_buscado = async (req, res) => {
    data_cliente = null;
    res.redirect("/cargar-nueva-interaccion/data-cliente");
}
router.get("/borrar-data-cliente", borrar_datos_del_cliente_buscado);

// Cargar y/o asociar cliente a la interaccion

const carga_data_cliente = async (req, res) => {
    var id_prov_cliente, provincia_cliente, id_semaforo_comercial_cliente, semaforo_descripcion
    // Provincias
    const prov = await listado_de_provincias()
    // Listado de semáforos
    const sem = await semaforos()
    // Clientes habilitados
    const clientes = await seleccionar_clientes_habilitados();
    // Declaración de variable global
    global.id_del_cliente_buscado;
    // Obtengo el cuit desde el form para buscar al cliente. 
    id_del_cliente_buscado = req.query.id;
    // Datos del cliente encontrado
    var data_cliente = await data_cliente_para_interaccion(id_del_cliente_buscado);
    console.log("data_cliente: ", data_cliente);
    if (data_cliente.length > 0) {
        id_prov_cliente = data_cliente[0]["provincia"];
        provincia_cliente = await obtener_provincia_por_id(id_prov_cliente)
        // console.log("provincia_cliente: ", provincia_cliente);
        id_semaforo_comercial_cliente = data_cliente[0]["semaforo_comercial"];
        semaforo_descripcion = await obtener_semaforo_por_id(id_semaforo_comercial_cliente)
        //console.log("semaforo_descripcion: ", semaforo_descripcion);
    }
    // console.log("data_cliente: ", data_cliente);
    res.render("INTERACCIONES/data_cliente", { clientes, semaforo_descripcion, provincia_cliente, data_cliente, prov, sem });
}

router.get("/data-cliente", carga_data_cliente);

const guardar_interaccion_data_cliente = async (req, res) => {
    var estado_de_busqueda;
    var cuit_del_cliente_cargado_en_interaccion = req.body.cuit;

    if (cuit_del_cliente_cargado_en_interaccion === undefined) {
        // console.log("Usó autocompleado...");
        // Si uso autocompletado: solo asocio el id del cliente a la interacción.
        //console.log("ID del cliente a asociar: ", id_del_cliente_buscado);
        id_de_cliente_a_relacionar = id_del_cliente_buscado;
        //console.log("id_de_cliente_a_relacionar: ", id_de_cliente_a_relacionar);
        res.redirect("/cargar-nueva-interaccion/data-interaccion")
    } else {
        // console.log("No usó autocompletado...");
        // Verico que no haya cargado un cuit que ya exista
        estado_de_busqueda = await verificar_si_el_cuit_del_cliente_ya_existe(cuit_del_cliente_cargado_en_interaccion)
        if (estado_de_busqueda.length > 0) {
            //console.log("Este cuit: ", cuit_del_cliente_cargado_en_interaccion, "fue encontrado en la base de datos.");
            //console.log("Conclusión: está repetido");
            // Solo asociamos este id que representa a ese cuit a la tabla interacciones
            const id_cliente_ = await obtener_id_del_cliente_usando_cuit(cuit_del_cliente_cargado_en_interaccion);
            const id = id_cliente_[0]["id"];
            id_de_cliente_a_relacionar = id;
            res.redirect("/cargar-nueva-interaccion/data-interaccion")

        } else {
            // console.log("Este cuit: ", cuit_del_cliente_cargado_en_interaccion, "no fue encontrado en la base de datos.");
            // console.log("Conclusión: no está repetido");
            const datos_del_nuevo_cliente = req.body;
            const cliente_creado = await crear_cliente(datos_del_nuevo_cliente);
            // console.log("cliente_creado: ", cliente_creado);
            const id_cliente_nuevo = await obtener_id_del_cliente_usando_cuit(cuit_del_cliente_cargado_en_interaccion);
            //console.log("id_cliente_nuevo: ", id_cliente_nuevo);
            const id = id_cliente_nuevo[0]["id"];
            id_de_cliente_a_relacionar = id;
            //console.log("id_de_cliente_a_relacionar: ", id_de_cliente_a_relacionar);
            res.redirect("/cargar-nueva-interaccion/data-interaccion")
        }

    }

}


router.post("/data-cliente/create", guardar_interaccion_data_cliente)


const form_carga_datos_especificos_interaccion = async (req, res) => {

    const estado = true;

    const users_responsables = await listar_usuarios(estado);

    const estados_interaccion = await seleccionar_estado()

    const int_estado = await seleccionar_estados_de_interaccion()

    const sec_interes = await selecciones_de_interes()
    // console.log("sec_interes: ", sec_interes);

    const tipo_maq = await listado_tipo_maquinarias(estado)



    res.render("INTERACCIONES/data_interaccion", { tipo_maq, sec_interes, int_estado, id_de_cliente_a_relacionar, estados_interaccion, users_responsables })

}

router.get("/data-interaccion", form_carga_datos_especificos_interaccion)


const guardar_interaccion = async (req, res) => {
    const data_interaccion = req.body;
    //console.log("data_interaccion :", data_interaccion);
    const intereaccion_creada = await crear_interaccion(data_interaccion);
    console.log("intereaccion_creada: ", intereaccion_creada);
    res.redirect("/interacciones");
}

router.post("/data-interaccion/create", guardar_interaccion)








module.exports = router;


/***
 * 
// Guarda y/o asocia los datos de un cliente a la base de datos 
const guardar_interaccion_data_cliente = async (req, res) => {

    var resultado; global.id_cliente_nuevo

    // Cuit del cliente cargado en interaccion
    var cuit_del_cliente_cargado_en_interaccion = req.body.cuit;

    // NO USA AUTOCOMPLETADO:
    if (cuit_del_cliente_cargado_en_interaccion) {

        // VERIFICO SI EL CUIT ESTÁ CARGADO
        resultado = await verificar_si_el_cuit_del_cliente_ya_existe(cuit_del_cliente_cargado_en_interaccion);

        // NO ESTA CARGADO EL CUIT - ES DECIR NO EXISTE EL CLIENTE
        if (resultado.length !== 0) {
            console.log("NO USASTE EL AUTOCOMPLEADO, CLIENTE CARGADO");
            // COMO EL CLIENTE NO EXISTE, LO CREO.
            //const cliente_nuevo_creado = await crear_cliente(req.body);
            //console.log("cliente_nuevo_creado: ", cliente_nuevo_creado);
            // UNA VEZ QUE LO CREÉ, OBTENGO SU ID
            //id_cliente_nuevo = await obtener_id_del_cliente_usando_cuit(cuit_del_cliente_cargado_en_interaccion);
            //console.log("id_cliente_nuevo: ", id_cliente_nuevo);
            res.end()
            // res.redirect("/cargar-nueva-interaccion/data-interaccion")

        } else {
            console.log("CARGÓ UN CUIT EXISTENTE, INCLUSO SIN USAR AUTOCOMPLEADO.");
            // CARGÓ UN CUIT EXISTENTE, INCLUSO SIN USAR AUTOCOMPLEADO.
            // Por lo tanto el buscamos el id que pertenece a ese cuit
            //id_cliente_nuevo = await obtener_id_del_cliente_usando_cuit(cuit_del_cliente_cargado_en_interaccion);
            //console.log("No usaste el autocompleado pero  cargaste un cuit que ya existe: ", id_cliente_nuevo);
            res.end()
        }


        // USA AUTOCOMPLETADO:
    } else {
        console.log("USASTE EL AUTOCOMPLEADO");
        //console.log("Usaste el autocompletado, id a asociar: ", id_del_cliente_buscado);
        res.end()

    }


}
 */