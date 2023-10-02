var express = require('express');
var router = express.Router();
 

const { single_usuario, convertir_usuario_a_admin, convertir_usuario_a_editor } = require("../../models/consulta")

const single_usuario_activo = async (req, res) => {

    const estado = true;

    const id = req.params.id;
    
    // console.log("id user: ", id);

    const data_de_usuario_single = await single_usuario(id, estado);
    
    console.log("data_de_usuario_single: ", data_de_usuario_single);

    res.render("USERS/user",  { data_de_usuario_single, estado })

}

router.get("/:id", single_usuario_activo);



const single_usuario_borrado = async (req, res) => {

    const estado = false;

    const id = req.params.id;
    
    // console.log("id user: ", id);

    const data_de_usuario_single = await single_usuario(id, estado);
    
    // console.log("data_de_usuario_single: ", data_de_usuario_single);

    res.render("USERS/user",  { data_de_usuario_single, estado })

}

router.get("/borrado/:id", single_usuario_borrado)


const fn_convertir_usuario_a_admin = async (req, res) => {
    try{
        const id_cliente = req.params.id;
        const usuario_admin = await convertir_usuario_a_admin(id_cliente);
        // console.log(usuario_admin);
        res.redirect("/usuarios")
    }catch(e){
        console.log(e);
    }
}

router.get("/:id/conver-admin", fn_convertir_usuario_a_admin);



const fn_convertir_usuario_a_editor = async (req, res) => {
    try{
        const id_cliente = req.params.id;
        const usuario_editor = await convertir_usuario_a_editor(id_cliente);
        // console.log(usuario_admin);
        res.redirect("/usuarios")
    }catch(e){
        console.log(e);
    }
}

router.get("/:id/conver-editor", fn_convertir_usuario_a_editor);

module.exports = router;
