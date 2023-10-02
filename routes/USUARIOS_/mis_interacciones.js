var express = require('express');
var router = express.Router();

const { obtener_interacciones_de_un_usuario } = require("../../models/consulta")

const mis_interacciones = async (req, res) => {
    const id_user = req.session.user;
    // console.log("id_user: ", id_user);
    const interacciones = await obtener_interacciones_de_un_usuario(id_user);
    res.render("USERS/mis-interacciones", { interacciones, id_user });
}

router.get("/:id", mis_interacciones)

module.exports = router;
