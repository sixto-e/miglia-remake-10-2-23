var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

const { editar_usuario_middleware } = require("../../middlewares/edit_user");
const { editar_pass_middleware } = require("../../middlewares/editar_pass");


const
    { obtener_contraseña, editar_usuario, single_usuario, obtener_data_desde_tabla_perfiles_usuarios,
        obtener_data_desde_tabla_zona_comercial, obtener_data_desde_tabla_tipos_usuarios, obtener_zonas_comerciales,
        obtener_roles_usuarios, obtener_perfiles_usuarios, actualizar_contraseña }

        = require('../../models/consulta');





const obtener_datos_foraneas_usuario = async (data_user) => {

    const t_descrip_ = data_user[0]["t_descrip"];
    const t_descrip = await obtener_data_desde_tabla_tipos_usuarios(t_descrip_);


    const z_descrip_ = data_user[0]["z_descrip"];
    const z_descrip = await obtener_data_desde_tabla_zona_comercial(z_descrip_)


    const p_descrip_ = data_user[0]["p_descrip"];
    const p_descrip = await obtener_data_desde_tabla_perfiles_usuarios(p_descrip_)


    return {
        t_descrip,
        z_descrip,
        p_descrip
    };

}


const mi_perfil = async (req, res) => {

    // Declaración de variables
    var rol_data, zona_comercial_data, perfil_data, fk_data;

    // Zonas comerciales
    const zonas_comerciales = await obtener_zonas_comerciales();
    // console.log("zonas_comerciales: ", zonas_comerciales);

    // Tipo de usuario
    const tipos_usuarios = await obtener_roles_usuarios();
    // console.log("tipos_usuarios: ", tipos_usuarios);

    // Perfiles usuarios
    const perfiles = await obtener_perfiles_usuarios();
    // console.log("perfiles: ", perfiles);

    // Id del usuario
    const id = req.params.id;
    console.log("id: ", id);

    const estado = true;

    // Datos del usuario
    const data_user = await single_usuario(id, estado)
    // console.log("data_user: ", data_user);

    if (data_user.length > 0) {

        fk_data = await obtener_datos_foraneas_usuario(data_user);

    }


    if (fk_data.t_descrip.length > 0 || fk_data.z_descrip.length > 0 || fk_data.p_descrip.length > 0) {

        rol_data = fk_data.t_descrip[0];
        // console.log("rol_data: ", rol_data);

        zona_comercial_data = fk_data.z_descrip[0];
        // console.log("zona_comercial_data: ", zona_comercial_data);

        perfil_data = fk_data.p_descrip[0];
        // console.log("perfil_data: ", perfil_data);
    }


    res.render("USERS/mi_perfil", { perfil_data, zona_comercial_data, rol_data, data_user, zonas_comerciales, tipos_usuarios, perfiles });
}

router.get("/:id", mi_perfil);





const guardar_cambios_usuario_habilitado = async (req, res) => {

    const cambios = req.body;

    // console.log("cambios: ", cambios);

    const id = req.params.id;

    // console.log("id: ", id);

    const usuario_editado = await editar_usuario(id, cambios);

    // console.log("usuario_editado: ", usuario_editado);


    res.redirect("/mi-perfil/" + id);

}

router.post("/:id/create", editar_usuario_middleware, guardar_cambios_usuario_habilitado)


const editar_contraseña_usuario_habilitado = async (req, res) => {


    const id_usuario = req.session.user;

    res.render("USERS/editar_contraseña", { id_usuario });


}

router.get("/editar-password/:id", editar_contraseña_usuario_habilitado);


const guardar_cambio_de_contraseña = async (req, res) => {


    var pass_nueva, pass_actual;

    // ID user
    var id_usuario = req.session.user;

    // Pass actual user obtenida desde la base de datos - antes de modificar
    const pass_de_la_base_de_datos = await obtener_contraseña(id_usuario);

    const pass_data_base = pass_de_la_base_de_datos[0]["pass"]
    // console.log("pass_data_base: ", pass_data_base);

    // Obtengo la contraseña actual desde el form
    pass_actual = req.body.pass_actual;
    // console.log("pass_actual: ", pass_actual);

    // Comparo la contraseña de la base de datos y la del form
    const chequeoPassword = await bcrypt.compare(pass_actual, pass_data_base);
    // console.log("chequeoPassword: ", chequeoPassword);

    // Si son iguales:
    if (chequeoPassword) {

        // Obtengo la nueva contraseña
        pass_nueva = req.body.pass_nueva;
        console.log("pass_nueva: ", pass_nueva);

        // Obtengo la nueva contraseña repetida
        const pass_repetida = req.body.pass_repetida;
        console.log("pass_repetida: ", pass_repetida);

        // Las comparo, si son iguales:
        if (pass_nueva === pass_repetida) {

            // Cifro una de ellas
            const pass_nueva_encriptada = await bcrypt.hash(pass_nueva, 8);
            // console.log("pass_nueva_encriptada: ", pass_nueva_encriptada);

            const pass_actualizada = await actualizar_contraseña(pass_nueva_encriptada, id_usuario);
            // console.log("pass_actualizada: ", pass_actualizada);

            res.redirect("/mi-perfil/" + id_usuario);
        } else {
            res.send("Las contraseñas nuevas no coinciden")
        }


    } else {
        res.send("La contraseña actual es incorrecta")
    }


}


router.post("/editar-password/:id/create", editar_pass_middleware, guardar_cambio_de_contraseña);


module.exports = router;
