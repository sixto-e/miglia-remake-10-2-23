var express = require('express');
var router = express.Router();

const { listado_tipo_maquinarias } = require("../../models/consulta")

const tipos_de_maquinarias_habilitadas = async (req, res) => {
    const estado = true;
    const tipos = await listado_tipo_maquinarias(estado);
    // console.log(tipos);
    res.render("MAQ/tipos_maq", { tipos })
}
router.get("/", tipos_de_maquinarias_habilitadas)

 

module.exports = router;
