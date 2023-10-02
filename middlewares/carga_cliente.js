const {schemas} = require('./../schemas/carga_cliente')

const validar_carga_cliente = (req, res, next)=>{
    const {error, value} = schemas.auth.validate(req.body);
    //utilizo operadores ternarios
    error ? res.status(422).json({error : error.details[0].message}) 
    :next()
}

module.exports = {validar_carga_cliente}