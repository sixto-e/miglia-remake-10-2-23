var express = require('express');
var router = express.Router();

const { guardar_tiempo_en_la_app } = require("../../models/consulta");

const salir = async (req, res) => {

    var id_usuario = req.session.user;
    console.log("panel id_usuario: ", id_usuario);

    req.session.user = null;

    // Tiempo en que deja la app
    const currentTime = Date.now();

    // Tiempo en la app = tiempo actual - momento en que inicié sesión
    const elapsedTime = currentTime - req.session.startTimePanel;
    console.log("elapsedTime: ", elapsedTime);

    // Fecha actual. Día actual.
    const fecha = new Date();

    // Ruta que visita el usuario
    const ruta = '/panel-de-control';

    // Tiempo en esa ruta
    const tiempo = elapsedTime / 60000;

    const datos_a_almacenar = { id_usuario, fecha, ruta, tiempo }
    console.log("datos_a_almacenar: ", datos_a_almacenar);

    // Guardo el tiempo en la app
    const tiempo_en_la_app = await guardar_tiempo_en_la_app(datos_a_almacenar);

    console.log("tiempo_en_la_app: ", tiempo_en_la_app);

    // Momento en el que dejó la app
    req.session.startTimePanel = currentTime;
    res.redirect("/");
}

router.get("/", salir);

module.exports = router;
