var express = require('express');
var router = express.Router();

const { seleccionar_maquinaria, getFotos } = require("../../models/consulta")


// Datos necesarios para acceder a mi proyecto de Google Cloud
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ projectId: 'principal-rope-394117', keyFilename: 'principal-rope-394117-50edf592e5aa.json' });
const bucket = storage.bucket('examplepoi');


// Obtiene referencias dentro de un row data packet. Termina por brindar las referencias fuera 
// de la row. Esto último es nuestro objetivo principal con esta función.
async function getPublicUrlsFromDatabase() {
    try {
        // Obtengo las referencias de las fotos desde la url dentro de un array de objetos
        const fotos = await getFotos();
        // console.log("fotos: ", fotos);

        // Situacion 1: No hay fotos
        if (!fotos || fotos.length === 0) {
            console.warn('No se encontraron fotos en la base de datos.');
            return []; // Devolvemos un arreglo vacío si no hay fotos en la base de datos
        }

        // Mapeamos los objetos RowDataPacket para obtener solo los nombres de las fotos. Eliminamos el array de objetos
        const photoNames = fotos.map(row => row.foto);
        // console.log("photoNames:", photoNames);

        return photoNames;

    } catch (error) {
        console.error('Error al obtener las fotos desde la base de datos:', error);
        return []; // Devolvemos un arreglo vacío si ocurre algún error
    }
}

async function getPublicUrls() {
    try {
        // obtenemos solo los nombres de las fotos. Fuera del array de objetos
        const photoNames = await getPublicUrlsFromDatabase();
        //console.log("photoNames: ", photoNames);

        // Creamos un arreglo para almacenar las URLs públicas
        const urls = await Promise.all(
            photoNames.map(async (photoName) => {
                if (!photoName) {
                    // Si el nombre de la foto es nulo o vacío, retornamos una URL "fantasma" vacía
                    return 'URL_FANTASMA';
                }

                // Verificamos si el nombre de la foto existe en Google Cloud Storage
                const file = bucket.file(photoName);
                const [exists] = await file.exists();

                if (exists) {
                    // Si el nombre de la foto existe, obtenemos la URL pública
                    const [url] = await file.getSignedUrl({
                        version: 'v4',
                        action: 'read',
                        expires: Date.now() + 1000 * 60 * 60, // 1 hora
                    });

                    return url;

                } else {
                    // Si el nombre de la foto no existe, retornamos una URL "fantasma" vacía
                    return 'URL_FANTASMA';
                }
            })
        );

        return urls;
    } catch (error) {
        console.error('Error al obtener las URLs públicas:', error);
        return []; // Devolvemos un arreglo vacío si ocurre algún error
    }
}


const maquinarias_habilitadas = async (req, res) => {

    const estado = true;
    // Listado de maquinarias
    const maquinarias = await seleccionar_maquinaria(estado);
    // Recorre la matriz de maquinarias y ajusta la propiedad "estilo" en consecuencia
    maquinarias.forEach((maquinaria) => {
        const estado = maquinaria.estado;
        // Define el estilo según las condiciones
        if (estado === '0km' || estado === 'Muy buena' || estado === 'Buen estado') {
            maquinaria.estilo = 'btn btn-success btn-sm';
        } else if (estado === 'Regular' || estado === 'A supervisar') {
            maquinaria.estilo = 'btn btn-danger btn-sm';
        }
    });
    // Recupera las fotos desde google cloud
    getPublicUrls()
        .then(urls => {
            const datos = maquinarias.map((newData, index) => ({
                ...newData,
                public_url: urls[index],
            }));
            // console.log("datos de maquinaria con url pública para fotos: ", datos);
            // Renderiza la vista 'fotos.hbs' y pasa las URLs públicas como propiedad
            res.render('MAQ/maquinaria', { datos, estado });
            
        })
        .catch(err => res.status(500).send(err));
}

router.get("/", maquinarias_habilitadas);

const maquinarias_borradas = async (req, res) => {

    const estado = false;

    const maquinarias_borradas = await seleccionar_maquinaria(estado);
    // Recorre la matriz de maquinarias_borradas y ajusta la propiedad "estilo" en consecuencia
    maquinarias_borradas.forEach((maquinaria) => {
        const estado = maquinaria.estado;

        // Define el estilo según las condiciones
        if (estado === '0km' || estado === 'Muy buena' || estado === 'Buen estado') {
            maquinaria.estilo = 'btn btn-success btn-sm';
        } else if (estado === 'Regular' || estado === 'A supervisar') {
            maquinaria.estilo = 'btn btn-danger btn-sm';
        }
    });
    // console.log("maquinarias_borradas: ", maquinarias_borradas);
    res.render("MAQ/maquinaria", { maquinarias_borradas, estado })

}

router.get("/borradas", maquinarias_borradas);


module.exports = router;
