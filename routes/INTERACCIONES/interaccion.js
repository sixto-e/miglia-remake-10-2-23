var express = require('express');
const { actualizar_una_interaccion, obtener_listado_de_clientes, listar_interaccion, selecciones_de_interes, listado_tipo_maquinarias, seleccionar_estados_de_interaccion, obtener_provincia_por_id, obterner_semaforo_por_su_id, cambiar_estado_de_una_interaccion, listar_usuarios, seleccionar_estado } = require('../../models/consulta');
var router = express.Router();


const single_interaccion_habilitada = async (req, res) => {
    var provincia_cliente, semaforo_comercial_cliente, interaccion_single_final;
    const id_inter = req.params.id;
    const info_inter_obtenida = await listar_interaccion(id_inter);
    if (info_inter_obtenida.length > 0) {
        const id_prov = info_inter_obtenida[0]["provincia"];
        const id_semaforo = info_inter_obtenida[0]["semaforo_comercial"];
        provincia_cliente = await obtener_provincia_por_id(id_prov)
        semaforo_comercial_cliente = await obterner_semaforo_por_su_id(id_semaforo);
        // En el código de abajo cambio los id de provincia y semáforo comercial por sus respectivas descripciones
        interaccion_single_final = info_inter_obtenida.map((arreglo) => ({
            ...arreglo,
            provincia: provincia_cliente[0]["prov_descrip"],
            semaforo_comercial: semaforo_comercial_cliente[0]["sem_descrip"]
        }));


        // console.log("interaccion_single_final: ", interaccion_single_final);

    }
    // console.log("interaccion_single_final: ", interaccion_single_final);
    res.render("INTERACCIONES/interaccion", { interaccion_single_final })

}

router.get("/:id", single_interaccion_habilitada);

const editar_interaccion = async (req, res) => {
    try {

        const estado = true;

        const id_interaccion = req.params.id_interaccion;

        // console.log("id_interaccion: ", id_interaccion);

        var info_interaccion = await listar_interaccion(id_interaccion);

        // console.log("info_interaccion: ", info_interaccion);

        const users_responsables = await listar_usuarios(estado);

        const estados_interaccion = await seleccionar_estado()

        const int_estado = await seleccionar_estados_de_interaccion()

        const sec_interes = await selecciones_de_interes()

        const tipo_maq = await listado_tipo_maquinarias(estado)

        const clientes = await obtener_listado_de_clientes(estado);

        proximo_contacto = info_interaccion[0]["prox_encuentro"];

        // Fecha en formato "DD-MM-YY"
        var fechaOriginal = proximo_contacto;

        // Dividir la fecha en día, mes y año
        var partesFecha = fechaOriginal.split("-");

        // Construir la fecha en formato "YYYY-MM-DD"
        var fechaFormateada = "20" + partesFecha[2] + "-" + partesFecha[1] + "-" + partesFecha[0];



        res.render("INTERACCIONES/editar_data_interaccion", { fechaFormateada, id_interaccion, clientes, tipo_maq, info_interaccion, users_responsables, estados_interaccion, int_estado, sec_interes })

    } catch (e) {
        console.log(e);
    }
}

router.get("/editar/:id_interaccion", editar_interaccion);

const aplicar_cambios_en_interaccion = async (req, res) => {

    try {
        const info = req.body;
        // console.log("info: ", info);
        const id_interaccion = req.params.id_interaccion;
        // console.log("id_interaccion: ", id_interaccion);
        const interaccion_editada = await actualizar_una_interaccion(info, id_interaccion);
        // console.log("interaccion_editada: ", interaccion_editada);
        res.redirect("/interaccion/" + id_interaccion)
    } catch (e) {
        console.log(e);
    }

}

router.post("/editar/:id_interaccion/create", aplicar_cambios_en_interaccion)



const borrar_interaccion = async (req, res) => {

    try {
        const estado = false;
        const id_interaccion = req.params.id_interaccion;
        // console.log("id_interaccion: ", id_interaccion);
        const interaccion_borrada = await cambiar_estado_de_una_interaccion(estado, id_interaccion);
        // console.log("interaccion_borrada: ", interaccion_borrada);
        res.redirect("/interacciones")

    } catch (e) {
        console.log(e);
    }
}

router.get("/borrar/:id_interaccion", borrar_interaccion)

module.exports = router;
