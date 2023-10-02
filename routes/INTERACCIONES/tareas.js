var express = require('express');
var router = express.Router();

const { cambiar_estado_de_una_interaccion, filtrar_tareas_por_id_usuario, seleccionar_tareas, seleccionar_estados_de_interaccion, listar_usuarios } = require("../../models/consulta")

const listado_de_tareas = async (req, res) => {
    const tareas = await seleccionar_tareas();
    const estado = true;
    const usuarios = await listar_usuarios(estado)
    const tareas_remake = tareas.map((arreglo) => {
        let estilo = "#3498db"; // Valor por defecto

        switch (arreglo.estado_inter) {
            case "En curso":
                estilo = "btn btn-primary btn-sm";
                break;
            case "Pendiente":
                estilo = "btn btn-warning btn-sm";
                break;
            // Agrega más casos si es necesario
            default:
                estilo = "btn btn-warning btn-sm";
                break;
        }

        return {
            ...arreglo,
            estilo: estilo
        };
    });

    // console.log("tareas_remake: ", tareas_remake);
    const estados_interacciones = await seleccionar_estados_de_interaccion();
    res.render("INTERACCIONES/tareas", { usuarios, tareas_remake, estados_interacciones })
}

router.get("/", listado_de_tareas)

const tareas_listadas_en_base_a_responsable = async (req, res) => {
    // ID del usuario responsable
    const id_user = req.params.id;
    // console.log("id_user: ", id_user);
    // Listado de usuarios para el filtro
    const estado = true;
    const usuarios = await listar_usuarios(estado)
    // Tareas, interacciones en curso y pendientes
    const tareas = await filtrar_tareas_por_id_usuario(id_user);
    // Lo mismo que tareas pero le agrego la propiedad estilo
    const tareas_remake = tareas.map((arreglo) => {
        let estilo = "#3498db"; // Valor por defecto

        switch (arreglo.estado_inter) {
            case "En curso":
                estilo = "btn btn-primary btn-sm";
                break;
            case "Pendiente":
                estilo = "btn btn-warning btn-sm";
                break;
            // Agrega más casos si es necesario
            default:
                estilo = "btn btn-warning btn-sm";
                break;
        }

        return {
            ...arreglo,
            estilo: estilo
        };
    });

    res.render("INTERACCIONES/tareas-por-respons", { tareas_remake, usuarios})
}

router.get("/de-usuario-nro/:id", tareas_listadas_en_base_a_responsable)



const borrar_tarea = async (req, res) => {

    try {
        const estado = false;
        const id_interaccion = req.params.id_interaccion;
        // console.log("id_interaccion: ", id_interaccion);
        const interaccion_borrada = await cambiar_estado_de_una_interaccion(estado, id_interaccion);
        // console.log("interaccion_borrada: ", interaccion_borrada);
        // console.log("interaccion_borrada: ", interaccion_borrada);
        res.redirect("/tareas")

    } catch (e) {
        console.log(e);
    }
}

router.get("/borrar/:id_interaccion", borrar_tarea)

module.exports = router;
