const joi = require('@hapi/joi');
const schemas = {
    auth: joi.object().keys({
        nombre: joi.string().required(),

        rol: joi.string().required(),

        perfil: joi.string().required(),

        telefono: joi.string().required(),

        mail: joi.string().email().required(),

        ubicacion: joi.string().required(),

        zona_comercial: joi.string().required(),

        contraseña: joi.string().pattern(/^[^\s]+$/).length(10).required()

            .messages({
                'string.base': 'La password debe ser una cadena valida',
                'string.length': 'La password debe tener exactamente 10 caracteres.',
                'string.pattern.base': 'La password no debe contener espacios en blanco',
                'any.required': 'La password es un campo requerido'
            }),

        observacion: joi.string().empty('').optional()
    })
}
module.exports = { schemas }