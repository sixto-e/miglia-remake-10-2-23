var express = require('express');
var router = express.Router();
const { listado_de_provincias, semaforos, crear_cliente, verificar_si_el_cuit_del_cliente_ya_existe } = require('../../models/consulta')
const { validar_carga_cliente } = require('../../middlewares/carga_cliente');


const form_carga_cliente = async(req, res) => {

    const prov = await listado_de_provincias();
    // console.log("prov: ", prov);

    const semaf = await semaforos();
    // console.log("semaf: ", semaf);

    res.render('CLIENTES/cargar_cliente', { prov, semaf });
}

router.get('/', form_carga_cliente);


const cargar_cliente = async (req, res) => {

    // Obtengo el cuit
    const cuit = req.body.cuit;

    // Verifico que no esté el cuit cargado
    const result = await verificar_si_el_cuit_del_cliente_ya_existe(cuit);
    // console.log("result: ", result);

    if (result.length === 0) {

        const datos = req.body;
 
        // console.log("datos: ", datos);

        const cliente_guardado = await crear_cliente(datos);
        
        // console.log("CLIENTES/cliente_guardado: ", cliente_guardado);

        res.redirect('/clientes');

    } else {

        res.end('<a href="/clientes">Carga no realizada debido a que el cuit ingresdo pertenece a otro cliente, verifique los datos</a>')
    }

}


router.post('/create', validar_carga_cliente, cargar_cliente)

module.exports = router;
