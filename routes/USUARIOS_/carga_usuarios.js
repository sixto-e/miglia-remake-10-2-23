var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

const {validar_carga_usuario} = require("../../middlewares/carga_user")


const { crear_usuario, verificar_existencia_de_usuario, obtener_zonas_comerciales, obtener_roles_usuarios, obtener_perfiles_usuarios } = require("../../models/consulta");

// Form para cargar el empleado
const form_carga_usuarios = async (req, res)=>{

    // Zonas comerciales
    const zonas_comerciales = await obtener_zonas_comerciales();

    // Tipo de usuario
    const tipos_usuarios = await obtener_roles_usuarios();

    // Perfiles usuarios
    const perfiles = await obtener_perfiles_usuarios()

    res.render('USERS/carga_usuario', { zonas_comerciales, tipos_usuarios, perfiles })

}

router.get("/", form_carga_usuarios)


// Carga el nuevo usuario
const guardar_usuario = async(req,res)=>{

    // Tomo la contraseña
    const pass = req.body.contraseña;

    // Encripto la contraseña
    const passEncriptada = await bcrypt.hash(pass, 8);

    // Agrego al cuerpo de información la contraseña encriptada
    req.body.contraseña = passEncriptada;

    // Guardo el cuerpo de la información con la contraseña encriptada
    const datos_del_nuevo_usuario = req.body;

    const mail = req.body.mail;

    const result = await verificar_existencia_de_usuario(mail);
    
    // console.log("result: ", result);
    
    if(result.length === 0){
    
        const nuevoEmpleado = await crear_usuario(datos_del_nuevo_usuario);

        // console.log("nuevoEmpleado: ", nuevoEmpleado);
    
        res.redirect("/usuarios")
    
    }else{
    
        res.end("<a href ='/cargar-usuario'>El mail ya existe, intente con otro mail</a>")
    }


}

router.post("/create", validar_carga_usuario, guardar_usuario)



module.exports = router;
