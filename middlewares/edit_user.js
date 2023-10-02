const {schemas} = require('./../schemas/edit_user');

const editar_usuario_middleware = (req, res, next)=>{
    const {error, value} = schemas.auth.validate(req.body);
    //utilizo operadores ternarios
    error ? res.status(422).json({error : error.details[0].message}) 
    :next()
}

module.exports = {editar_usuario_middleware}