var express = require('express');
var router = express.Router();
const path = require('path')
const {obtener_listado_de_clientes} =  require('../../models/consulta')
// const {validacion_clientes} = require('../../middlewares/validar_carga_clientes');

const listado_de_clientes_habilitados = async(req, res) => {

    // Solo los habilitados
    const estado = true;

    // Listado de clientes
    const clientes = await obtener_listado_de_clientes(estado);


    res.render('CLIENTES/clientes', {clientes, estado});
}

router.get('/', listado_de_clientes_habilitados);


const listado_de_clientes_borrados = async(req, res) => {

    // Solo los habilitados
    const estado = false;

    // Listado de clientes
    const clientes_borrados = await obtener_listado_de_clientes(estado);
    console.log("clientes_borrados: ", clientes_borrados);

    res.render('CLIENTES/clientes', {clientes_borrados, estado});
}

router.get('/borrados', listado_de_clientes_borrados);


module.exports = router;
