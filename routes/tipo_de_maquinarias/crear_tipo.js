var express = require('express');
var router = express.Router();

const { crear_tipo_de_maquinaria, verificar_si_hay_tipos_repetidos } = require("../../models/consulta")


const form_carga_tipo_maq = (req, res) => {

    res.render("MAQ/carga_tipo_maq");

}

router.get("/", form_carga_tipo_maq)

const guardar_tipo_maq = async (req, res) => {
    // String para comprobar que si está cargado
    const data_string = req.body.tipo;
    // Nuevo tipo de maquinaria. En formato aceptable para la consulta.
    const data_obj = req.body
    
    const resultado = await verificar_si_hay_tipos_repetidos(data_string);
    // Esta cargado el tipo que se intenta cargar
    if (resultado.length > 0) {
        res.end(`<a href="/cargar-nuevo-tipo-maquinaria">Este tipo ya existe, no se puede cargar de nuevo !</a>`)
    } else {
        // No está cargado, lo cargo.
        const nuevo_tipo = await crear_tipo_de_maquinaria(data_obj);
       
        res.redirect("/tipos-de-maquinarias")

    }



}

router.post("/create", guardar_tipo_maq)


module.exports = router;
