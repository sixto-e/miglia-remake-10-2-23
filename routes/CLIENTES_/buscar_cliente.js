var express = require('express');
var router = express.Router();

const { buscar_cliente_ } = require("../../models/consulta");

const form_busqueda_cliente = async (req, res) => {
    res.render("CLIENTES/buscar_cliente");
}
router.get("/", form_busqueda_cliente)





const getInfo = async (req, res) => {

    //todos tienen req.query.razon_social porque el campo donde se coloca la informacion tiene ese nombre(name).

    const razon_social = req.query.razon_social;

    const contacto = req.query.razon_social;

    const cuit = req.query.razon_social;

    const localidad = req.query.razon_social;

    const habilitado = true;

    const clientes = await buscar_cliente_(razon_social, contacto, cuit, localidad, habilitado);

    //if the result it's equal to 0 means that the client doesn't exist or data is incorrect.
    if (clientes.length == 0) {

        //if found = false it's means that user couldn't find the client
        const found = false;

        res.render('CLIENTES/buscar_cliente', { found });


    } else {
        //this run when client was found.
        const found = true;
        res.render('CLIENTES/buscar_cliente', { clientes, found });
    }


}

router.get('/create', getInfo);

module.exports = router;
