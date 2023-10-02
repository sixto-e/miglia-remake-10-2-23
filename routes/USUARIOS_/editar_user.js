var express = require('express');
var router = express.Router();

const { obtener_data_desde_tabla_perfiles_usuarios, obtener_data_desde_tabla_zona_comercial, obtener_data_desde_tabla_tipos_usuarios, editar_usuario, obtener_zonas_comerciales, obtener_roles_usuarios, obtener_perfiles_usuarios, single_usuario } = require("../../models/consulta");

const { editar_usuario_middleware }  = require("../../middlewares/edit_user");


// datos_usuario devuelve entre otras cosas las siguientes propiedades y sus respectivos valores:
// 1 - t_descrip: 'valor'
// 2 - z_descrip: 'valor',
// 2 - p_descrip: 'valor'
// Los valores que devuelven son string. Es decir, sólo la descripción. 
// Necesito más. Necesito los id de esas descripcion. 
// Esos vamos a obtener con la siguiente función.
const obtener_datos_foraneas_usuario = async (datos_usuario) => {

    const t_descrip_ = datos_usuario[0]["t_descrip"];
    const t_descrip = await obtener_data_desde_tabla_tipos_usuarios(t_descrip_);


    const z_descrip_ = datos_usuario[0]["z_descrip"];
    const z_descrip = await obtener_data_desde_tabla_zona_comercial(z_descrip_)


    const p_descrip_ = datos_usuario[0]["p_descrip"];
    const p_descrip = await obtener_data_desde_tabla_perfiles_usuarios(p_descrip_)


    return {
        t_descrip,
        z_descrip,
        p_descrip
    };

}



const form_editar_usuario_habilitado = async (req, res) => {
    // Declaración de variables
    var rol_data, zona_comercial_data, perfil_data, fk_data;

    // Id del usuario a editar
    const id = req.params.id;

    // Usuario habilitado
    const estado = true;

    // Zonas comerciales
    const zonas_comerciales = await obtener_zonas_comerciales();
    // console.log("zonas_comerciales: ", zonas_comerciales);

    // Tipo de usuario
    const tipos_usuarios = await obtener_roles_usuarios();
    // console.log("tipos_usuarios: ", tipos_usuarios);

    // Perfiles usuarios
    const perfiles = await obtener_perfiles_usuarios();
    // console.log("perfiles: ", perfiles);

    const datos_usuario = await single_usuario(id, estado);
    //console.log("datos_usuario: ", datos_usuario);

    if (datos_usuario.length > 0) {

        fk_data = await obtener_datos_foraneas_usuario(datos_usuario);

    }
    

    if (fk_data.t_descrip.length > 0 || fk_data.z_descrip.length  > 0 || fk_data.p_descrip.length > 0) {

        rol_data = fk_data.t_descrip[0];
        // console.log("rol_data: ", rol_data);

        zona_comercial_data = fk_data.z_descrip[0];
        // console.log("zona_comercial_data: ", zona_comercial_data);

        perfil_data = fk_data.p_descrip[0];
        // console.log("perfil_data: ", perfil_data);
    }


    res.render("USERS/editar_user", { perfil_data, zona_comercial_data, rol_data, datos_usuario, perfiles, tipos_usuarios, zonas_comerciales })
}

router.get("/:id", form_editar_usuario_habilitado)


const guardar_cambios_usuario_habilitado = async (req, res) => {

    const cambios = req.body;

    console.log("cambios: ", cambios);

    const id = req.params.id;

    console.log("id: ", id);

    const usuario_editado = await editar_usuario(id, cambios);

    console.log("usuario_editado: ", usuario_editado);


    res.redirect("/usuarios");

}

router.post("/:id/create", editar_usuario_middleware, guardar_cambios_usuario_habilitado)


module.exports = router;
