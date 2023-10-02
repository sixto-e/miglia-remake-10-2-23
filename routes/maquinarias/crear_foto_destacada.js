var express = require('express');
var router = express.Router();
const multer = require('multer')
const sharp = require('sharp');
const { Storage } = require('@google-cloud/storage');
const { setImage } = require("../../models/consulta")
const { v4: uuidv4 } = require('uuid');
const upload = multer({ storage: multer.memoryStorage() });

// Configuración de Google Cloud Storage.
const storage = new Storage({
    projectId: 'principal-rope-394117',
    keyFilename: 'principal-rope-394117-50edf592e5aa.json', // Ruta al archivo de credenciales
});

// Reemplaza con el nombre de tu bucket
const bucket = storage.bucket('examplepoi');


const hbs_form_carga_foto_destacada = async (req, res) => {

    const id_maquinaria = req.params.id_maquinaria;
    console.log("id_maquinaria: ", id_maquinaria);

    res.render("MAQ/crear_foto_destacada", { id_maquinaria })

}

router.get("/:id_maquinaria", hbs_form_carga_foto_destacada)

// Genera un nombre único para la foto destacada
const getUniqueFileName = (originalFileName) => {

    // Obtenemos la extensión del archivo original (por ejemplo, '.jpg', '.png', etc.).
    const fileExtension = originalFileName.split('.').pop();

    // Generamos un nombre de archivo único basado en la fecha y hora actual.
    const uniqueName = uuidv4();
    const newFileName = `${uniqueName}.${fileExtension}`;

    return newFileName;
};


// Función para redimensionar la imagen
async function resizeImage(buffer) {
    try {
        // Redimensionar la imagen a un nuevo tamaño específico (por ejemplo, 800x600)
        const resizedImageBuffer = await sharp(buffer)
        .resize(
            {
              width: 600,
              height: 400,
              fit: "contain",
              position: "center",
              withoutEnlargement: true,
              background: {
                r: 255,
                g: 255,
                b: 255
              }
            }) // 'fit' and 'position' options are optional but can be useful
          .toBuffer();
        return resizedImageBuffer;
    } catch (err) {
        throw new Error('Error al redimensionar la imagen.');
    }
}


// Guardar fotos
router.post('/:id_maquinaria/create', upload.single('foto'), async (req, res) => {
    try {
        if (req.file) {
            // console.log("Imagen encontrada, tratando de subirla...");

            // Generamos un nuevo nombre de archivo único basado en la fecha y hora actual.
            const newFileName = getUniqueFileName(req.file.originalname);

            // Agrego la referencia de la foto a la base de datos
            const id = req.params.id_maquinaria;
            console.log("id: ", id);
            const agregarFoto = await setImage(newFileName, id);

            // Redimensionar la imagen antes de guardarla en el bucket
            const resizedImageBuffer = await resizeImage(req.file.buffer);

            // Creamos una referencia al nuevo archivo en el bucket de Google Cloud Storage.
            const blob = bucket.file(newFileName);

            //console.log("Esto hay dentro de la variable blob: ", blob);

            // Creamos un stream de escritura para el nuevo archivo.
            const blobStream = blob.createWriteStream();

            // Cuando el stream de escritura termine (finish), enviamos una respuesta al cliente
            // indicando que la subida fue exitosa.
            blobStream.on("finish", () => {
                res.redirect("/maquinaria/" + id)
            });

            // Escribimos los datos del archivo redimensionado en el stream de escritura para que se guarde con el nuevo nombre.
            blobStream.end(resizedImageBuffer);
        } else {
            // Si no se envió ningún archivo en la solicitud, enviamos un mensaje de error al cliente.
            res.status(400).send("No se proporcionó ninguna imagen en la solicitud.");
        }
    } catch (e) {
        // Si ocurre algún error durante el proceso de subida de la imagen,
        // enviamos un mensaje de error al cliente con el código de estado 500 (Internal Server Error).
        res.status(500).send(e.message);
    }
});






module.exports = router;