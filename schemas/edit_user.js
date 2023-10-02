const joi = require('@hapi/joi');
const schemas = {
    auth : joi.object().keys({
        nombre: joi.string().required(),

        rol: joi.string().required(),

        perfil: joi.string().required(),

        telefono: joi.string().required(),

        mail: joi.string().email().required(),

        ubicacion: joi.string().required(),

        zona_comercial: joi.string().required(),       

        observaciones: joi.optional()
    })
}
module.exports = {schemas}