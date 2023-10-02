const verificar_inicio_de_sesion = (req, res, next) => {
    // SI
    req.session.user ? (next())
        // SI NO
        : res.end(`<a href = "/login">Logueate, por favor.</a>`)
}

module.exports = { verificar_inicio_de_sesion }
