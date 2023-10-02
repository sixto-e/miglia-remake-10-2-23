const joi = require('@hapi/joi');
const schemas = {
    auth: joi.object().keys({
         pass_actual : joi.string().pattern(/^[^\s]+$/).length(10).required(),

        pass_nueva: joi.string().pattern(/^[^\s]+$/).length(10).required()
            .messages({
                'string.base': 'La password debe ser una cadena valida',
                'string.length': 'La password debe tener exactamente 10 caracteres',
                'string.pattern.base': 'La password no debe contener espacios en blanco',
                'any.required': 'La password es un campo requerido'
            }),

        pass_repetida: joi.string().pattern(/^[^\s]+$/).length(10).required()
            .messages({
                'string.base': 'La contraseña debe ser una cadena valida',
                'string.length': 'La contraseña debe tener exactamente 10 caracteres',
                'string.pattern.base': 'La contraseña no debe contener espacios en blanco',
                'any.required': 'La contraseña es un campo requerido'
            }),
    })
}
module.exports = { schemas }