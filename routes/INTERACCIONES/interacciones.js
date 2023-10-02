var express = require('express');
var router = express.Router();

const { seleccionar_intereacciones, seleccionar_estados_de_interaccion, seleccionar_interacciones_por_estado } = require("../../models/consulta");

const interacciones_habilitadas = async (req, res) => {

    const list_inter = await seleccionar_intereacciones();

    // Función para asignar el estilo en función del valor de estado_inter
    function asignarEstilo(estado_inter) {
        switch (estado_inter) {
            case 'Pendiente':
                return 'btn btn-warning btn-sm';
            case 'En curso':
                return 'btn btn-primary btn-sm';
            case 'Concretada':
                return 'btn btn-success btn-sm';
            case 'Cancelada':
                return 'btn btn-danger btn-sm';
            default:
                return '';
        }
    }

    // Iterar a través de la lista y agregar la propiedad 'estilo' a cada objeto
    list_inter.forEach(item => {
        item.estilo = asignarEstilo(item.estado_inter);
    });

    const estados_interacciones = await seleccionar_estados_de_interaccion();

    // console.log("list_inter: ", list_inter);

    res.render("INTERACCIONES/interacciones", { list_inter, estados_interacciones });

}

router.get("/", interacciones_habilitadas);

const interacciones_por_estado = async (req, res) => {

    const id_estado = req.params.id;

    // console.log("id_estado: ", id_estado);

    const interacciones_basadas_en_estado = await seleccionar_interacciones_por_estado(id_estado);

    const interacciones_basadas_en_estado_remake = interacciones_basadas_en_estado.map((arreglo) => {
        let estilo = "#3498db"; // Valor por defecto

        switch (arreglo.estado_inter) {
            case "En curso":
                estilo = "btn btn-primary";
                break;
            case "Concretada":
                estilo = "btn btn-success";
                break;
            case "Pendiente":
                estilo = "btn btn-warning";
                break;
            case "Cancelada":
                estilo = "btn btn-danger";
                break;
            // Agrega más casos si es necesario
            default:
                estilo = "btn btn-primary";
                break;
        }

        return {
            ...arreglo,
            estilo: estilo
        };
    });



    // console.log("interacciones_basadas_en_estado: ", interacciones_basadas_en_estado);
    const estados_interacciones = await seleccionar_estados_de_interaccion();

    // console.log("interacciones_basadas_en_estado_remake: ", interacciones_basadas_en_estado_remake);
    res.render("INTERACCIONES/inters_por_estado", { interacciones_basadas_en_estado_remake, estados_interacciones })

}

router.get("/:id", interacciones_por_estado)

module.exports = router;
