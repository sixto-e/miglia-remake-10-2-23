const joi = require('joi');

const schemas = {
  auth: joi.object().keys({

    cuit: joi.number().required().integer().min(10000000000).max(99999999999)
      .messages({
        'number.base': 'El CUIT debe ser un numero valido',
        'number.min': 'El CUIT debe tener 11 digitos',
        'number.max': 'El CUIT debe tener 11 digitos',
        'any.empty': 'El CUIT es un campo requerido'
      }),

    razon_social: joi.string().required().messages({
      'string.empty': "Nombre no puede estar vacio",
    }),

    nombre_contacto: joi.string().required().messages({
      'string.empty': "Nombre de contacto no puede estar vacio",
    }),

    provincia: joi.number().required(),

    localidad: joi.string().required().messages({
      'string.empty': "Localidad no puede estar vacio",
    }),

    direccion: joi.string().required().messages({
      'string.empty': "Direccion no puede estar vacio",
    }),

    telefono: joi.string().required().messages({
      'string.empty': "Telefono no puede estar vacio",
    }),

    mail: joi.string().empty('').optional(),

    semaforo_comercial : joi.number().required(),

    observacion: joi.string().empty('').optional()


  })
}

module.exports = { schemas }
