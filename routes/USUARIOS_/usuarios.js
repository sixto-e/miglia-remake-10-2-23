var express = require('express');
var router = express.Router();

const { listar_usuarios, borrar_usuario } = require("../../models/consulta");

const listado_de_usuarios_habilitados = async (req, res) => {

    const estado = true;

    const usuarios = await listar_usuarios(estado);

    const all = true;

    // console.log("usuarios: ", usuarios);

    res.render("USERS/usuarios", { usuarios, all})
}

router.get("/", listado_de_usuarios_habilitados)

const listado_de_usuarios_borrados= async (req, res) => {

    const estado = false;

    const usuarios_borrados = await listar_usuarios(estado);

    const all = false;

    // console.log("usuarios: ", usuarios);

    res.render("USERS/usuarios", { usuarios_borrados, all})
}

router.get("/borrados", listado_de_usuarios_borrados)



const borrar_usuario_router  = async (req, res) => {

    const id_usuario = req.params.id;

    // console.log("id usuario a borrar: ", id_usuario);

    const estado = false;

    const usuario_borrado = await borrar_usuario(id_usuario, estado)

    // console.log("usuario_borrado: ", usuario_borrado);
    
    res.redirect("/usuarios");
}

router.get("/borrar/:id", borrar_usuario_router)

const habilitar_usuario_router  = async (req, res) => {

    const id_usuario = req.params.id;

    const estado = true;

    const usuario_activado = await borrar_usuario(id_usuario, estado)
    
    res.redirect("/usuarios");
}

router.get("/habilitar/:id", habilitar_usuario_router)






module.exports = router;
