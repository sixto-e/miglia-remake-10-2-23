var express = require('express');
var router = express.Router();
const { buscar_maquinaria, listado_tipo_maquinarias } = require("../../models/consulta");


const hbs_buscar = async (req, res) => {

    const estado = true;

    const tiposDeMaquinas = await listado_tipo_maquinarias(estado);

    // console.log("tipos_maq: ", tiposDeMaquinas);

    res.render('MAQ/buscar', { tiposDeMaquinas });
}
router.get("/", hbs_buscar)

const buscando_maquinaria = async (req, res) => {
    try {

        const estado = true;
        const tiposDeMaquinas = await listado_tipo_maquinarias(estado);
        const id_tipo_maq = req.query.id_tipo_maq;
        // console.log("id_tipo_maq: ", id_tipo_maq);

        const maquinarias = await buscar_maquinaria(id_tipo_maq);
        maquinarias.forEach((maquinaria) => {

            const estado = maquinaria.estado;
            // Define el estilo según las condiciones
            if (estado === '0km' || estado === 'Muy buena' || estado === 'Buen estado') {
                maquinaria.estilo = 'btn btn-success btn-sm';
            } else if (estado === 'Regular' || estado === 'A supervisar') {
                maquinaria.estilo = 'btn btn-danger btn-sm';
            }
        });

        // console.log("maquinarias: ", maquinarias);
        
        res.render('MAQ/buscar', { maquinarias, tiposDeMaquinas });

    } catch (e) {
        console.log(e);
    }
}

router.get("/create", buscando_maquinaria)

module.exports = router;
