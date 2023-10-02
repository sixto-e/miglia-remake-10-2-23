var express = require('express');
var router = express.Router();

const panel = async (req, res) => {
    const user_id = req.session.user;
    //!req.session.startTimePanel es una variable global.
    // Si existe quiere decir que el usuario está logueado
    // Dentro de ésta guardamos el tiempo actual.
    // Seguimos con otra cosa
    if (!req.session.startTimePanel) {

        req.session.startTimePanel = Date.now();
        console.log("req.session.startTimePanel: ", req.session.startTimePanel);

        // No exite req.session.startTimePanel. Es decir, me deslogueo o todavía no me logueé
    }
    res.render("USERS/panel", { user_id });

}

router.get("/", panel);

module.exports = router;