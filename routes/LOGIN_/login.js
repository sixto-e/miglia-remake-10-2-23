var express = require('express');
var router = express.Router();

var { compare } = require('bcryptjs');

const { verificar_existencia_de_usuario } = require("../../models/consulta")

const form_login = async (req, res) => {

    res.render("USERS/login_form")
}

router.get("/", form_login);


const login = async (req, res) => {

    // Obtengo el mail de usuario
    const mail = req.body.mail;

    // Obtengo los datos del usuario con dicho mail.
    const result = await verificar_existencia_de_usuario(mail);
    //console.log("result:" , result);

    // Usuario no existe
    if (result.length == 0) {
        res.send('El mail no existe');

        // Usuario existe
    } else {
        // Obtengo contraseña cifrada desde base de datos
        const [{ pass }] = result;
        // console.log("pass: ", pass);

        // Obtengo pass no cifrada desde base de datos
        const passwordFromForm = req.body.contraseña;
        // console.log("passwordFromForm: ", passwordFromForm);

        // Compara las pass
        const chequeoPassword = await compare(passwordFromForm, pass);
        // console.log("chequeoPassword: ", chequeoPassword);
        // pass iguales
        if (chequeoPassword) {

            // Desestructuro el resultado
            const [{ id, mail, rol }] = result;

            // req genera variables globales. Gracias a la libreria express-session
            // Entonces tenemos al id, al email y al rol como variables globales.
            // Entonces podemos acceder a esos valores desde cualquier parte del sistema... 

            req.session.user = id;

            req.session.email = mail;

            req.session.rol = rol;

            // console.log("req.session.rol: ", req.session.rol);

            // Usuario es administrador
            if (req.session.rol == 1) {
                res.redirect("/panel-de-control")
                // No es administrador
            } else if(req.session.rol == 2) {
                res.redirect("/mis-interacciones/" + req.session.user);
            }

    } else {
        res.send('La contraseña es incorrecta')
    }

}

}



router.post('/create', login);



module.exports = router;
