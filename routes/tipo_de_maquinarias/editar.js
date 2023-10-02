var express = require('express');
var router = express.Router();

const { single_tipo_maq, editar_tipo_maquinaria, verificar_si_hay_tipos_repetidos } = require("../../models/consulta")

const form_editar_tipo_maquinaria = async (req, res) => {

    global.maq_tipo_en_single;

    const id = req.params.id;

    const maq_tipo = await single_tipo_maq(id);

    maq_tipo_en_single = maq_tipo[0]["tipo"];

    console.log("maq_tipo_en_single: ", maq_tipo_en_single);


    res.render("MAQ/editar_tipo_maq", { maq_tipo })
}

router.get("/:id", form_editar_tipo_maquinaria);

const guardar_edicion_tipo_maquinaria = async (req, res) => {

    // Declaración de variables
    var maq_tipo_editado, data_string, cambio, id
    // ID del tipo que voy a modificar
    id = req.params.id;
    // String para comprobar que si está cargado
    data_string = req.body.tipo;
    // Nuevo tipo de maquinaria. En formato aceptable para la consulta.
    cambio = req.body;

    if (data_string === maq_tipo_en_single) {

        console.log("data_string === maq_tipo_en_single: ", data_string === maq_tipo_en_single);

        maq_tipo_editado = maq_tipo_editado = await editar_tipo_maquinaria(cambio, id);

        res.redirect("/tipos-de-maquinarias");

    } else {

        var resultado = await verificar_si_hay_tipos_repetidos(data_string);

        // Esta cargado el tipo que se intenta cargar
        if (resultado.length > 0) {
            res.end(`<a href="/cargar-nuevo-tipo-maquinaria">Este tipo ya existe, no se puede cargar de nuevo !</a>`)
        } else {
            // No esta cargado, entonces lo edito.
            maq_tipo_editado = await editar_tipo_maquinaria(cambio, id);
            res.redirect("/tipos-de-maquinarias")

        }
    }






}

router.post("/:id/create", guardar_edicion_tipo_maquinaria);




module.exports = router;
