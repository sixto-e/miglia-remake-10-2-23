var express = require('express');
var router = express.Router();




const { mayor_interes_en_estas_maquinas, cant_maq_0km, cant_maq_a_supervisar, cant_maq_buen_estado, cant_maq_regular, cant_maq_muy_buena, cant_interaciones_en_curso, cant_interaciones_concretadas, cant_interaciones_pendientes, cant_interaciones_canceladas } = require("../../models/consulta");

router.get('/', async (req, res) => {
    try {
        const [en_curso_, pendiente_, canceladas_, concretadas_] = await Promise.all([
            cant_interaciones_en_curso(),
            cant_interaciones_pendientes(),
            cant_interaciones_canceladas(),
            cant_interaciones_concretadas()
        ]);

        // Crear un objeto con los valores
        const cantidades = {
            en_curso: en_curso_,
            pendiente: pendiente_,
            canceladas: canceladas_,
            concretadas: concretadas_
        };

        // Enviar la respuesta como JSON
        res.json(cantidades);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Error al obtener las cantidades' });
    }
});


router.get('/mas-interes-en', async (req, res) => {
    try {
        const [maquinarias_con_mayor_interes] = await Promise.all([
            mayor_interes_en_estas_maquinas()
        ]);

        // Crear un objeto con los valores
        const cantidades = {
            maq_int_mas_buscadas : maquinarias_con_mayor_interes

        };

        // Enviar la respuesta como JSON
        res.json(cantidades);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Error al obtener las cantidades' });
    }
});



router.get('/maquinaria', async (req, res) => {
    try {
        const [_0km, supervisar, buen_estado, regular, muy_buena] = await Promise.all([
            cant_maq_0km(), cant_maq_a_supervisar(), cant_maq_buen_estado(), cant_maq_regular(), cant_maq_muy_buena()
        ]);

        // Crear un objeto con los valores
        const cantidades = {
            maq_ok: _0km,
            maq_superv: supervisar,
            maq_buen_est: buen_estado,
            maq_reg: regular,
            maq_muy_buena: muy_buena

        };

        // Enviar la respuesta como JSON
        res.json(cantidades);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Error al obtener las cantidades' });
    }
});



module.exports = router;
