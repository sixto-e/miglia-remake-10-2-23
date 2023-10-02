var express = require('express');
var router = express.Router();

const { listado_tipo_maquinarias, seleccionar_estado, seleccionar_modalidad, seleccionar_disponibilidad, cargar_maquinaria } = require("../../models/consulta")

const form_carga = async (req, res) => {
    try {

        const estado = true;
        // Selec tipo de maq
        const tipos_de_maquinarias = await listado_tipo_maquinarias(estado)
        // console.log("tipos_de_maquinarias: ", tipos_de_maquinarias);
        // Selec estado
        const maq_estados = await seleccionar_estado();
        // console.log("maq_estados: ", maq_estados);
        // Selec modalidad
        const maq_modalidades = await seleccionar_modalidad();
        // console.log("maq_modalidades: ", maq_modalidades);
        // Selec disponibilidad
        const maq_disponibilidad = await seleccionar_disponibilidad()
        // console.log("maq_disponibilidad: ", maq_disponibilidad);
        res.render("MAQ/crear_maquinaria", { tipos_de_maquinarias, maq_estados, maq_modalidades, maq_disponibilidad })
    } catch (e) {
        console.log(e);
    }
}

router.get("/", form_carga);

const guardar_maquinaria = async (req, res) => {
    try {
        const data = req.body;
        // console.log("data: ", data);

        const maquinaria_creada = await cargar_maquinaria(data);
        // console.log("maquinaria_creada: ", maquinaria_creada);

        res.redirect("/maquinarias")

    } catch (e) {
        console.log(e);
    }

}
router.post("/create", guardar_maquinaria)



module.exports = router;
