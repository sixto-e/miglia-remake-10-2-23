var express = require('express');
var router = express.Router();
const { Storage } = require('@google-cloud/storage');
const multer = require('multer')
const sharp = require('sharp');
const { addFoto } = require("../../models/consulta");
const { v4: uuidv4 } = require('uuid');
const upload = multer({ storage: multer.memoryStorage() });


// Configuración de Google Cloud Storage.
const storage = new Storage({
  projectId: 'principal-rope-394117',
  keyFilename: 'principal-rope-394117-50edf592e5aa.json', // Ruta al archivo de credenciales
});

// bucket
const bucket = storage.bucket('examplepoi');


// Renderiza el formulario de carga
const render_cargar_galeria_hbs = async (req, res) => {

  const id_maquinaria = req.params.id;
  // console.log("id_maquinaria: ", id_maquinaria);

  res.render("MAQ/crear_galeria", { id_maquinaria });

}

router.get("/:id", render_cargar_galeria_hbs)

// Genera nombres únicos para las fotos.
const getUniqueFileNames = (originalFileNames) => {
  const uniqueFileNames = [];
  for (const originalFileName of originalFileNames) {
    // Obtenemos la extensión del archivo original (por ejemplo, '.jpg', '.png', etc.).
    const fileExtension = originalFileName.split('.').pop();

    // Generamos un nombre de archivo único utilizando UUID.
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    uniqueFileNames.push(uniqueFileName);
  }
  return uniqueFileNames;
};

// Función para redimensionar la imagen
async function resizeImage(buffer) {
  try {
    // Redimensionar la imagen a un nuevo tamaño específico (por ejemplo, 800x600)
    const resizedImageBuffer = await sharp(buffer)
      .resize(
        {
          width: 800,
          height: 600,
          fit: "contain",
          position: "center",
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



// Guarda las fotos en google cloud
router.post('/create/:id', upload.array('fotos', 11), async (req, res) => {

  // Redimensionar la imagen antes de guardarla en el bucket
  var resizedImageBuffer = []

  // cantidad de archivos
  const tamaño = req.files.length;

  // ID de la máquina_: Para redireccionar....
  const id_maquina = req.params.id;

  // Obtener nombres originales de los archivos cargados
  const originalFileNames = req.files.map(file => file.originalname);

  // Generar nuevos nombres de archivo únicos
  const newFileNames = getUniqueFileNames(originalFileNames);

  // Lógica para agregar las referencias de las fotos a la base de datos
  for (let i = 0; i < tamaño; i++) {
    const id_maquina = req.params.id;
    const referencia = newFileNames[i];
    var obj = { id_maquina, referencia };
    await addFoto(obj);
  }

  for (let i = 0 ; i < tamaño; i++) {

    resizedImageBuffer[i] = await resizeImage(req.files[i].buffer);
  }

  try {
    // Promesas para subir las imágenes
    const promesasSubida = newFileNames.map((newFileName, index) => {

      return new Promise((resolve, reject) => {

        // El objeto Blob representa el destino, el nombre y los datos binarios de la imagen. 
        const blob = bucket.file(newFileName);
        // bucket representa el bucket de destino. bucket tiene una dirección asociada.
        // .file() significa que en ese destino se escriba un archivo con el nombre que recibe como parámetro.


        // Crea un objeto BlobStream que representa un stream de escritura para el objeto Blob.
        const blobStream = blob.createWriteStream();
        // Un STREAM de escritura es un objeto que permite escribir datos(una imagen) en un destino.
        // En este caso, el destino es el objeto Blob.blob es el objeto que representa el archivo que se va a crear en el bucket.
        // .createWriteStream() es un método que crea un objeto BlobStream(STREAM de escritura) para el objeto Blob.


        // Registra el evento "finish" del objeto BlobStream.
        blobStream.on("finish", () => { resolve(); });
        /**
         * blobStream es el objeto que representa el stream de escritura.
         * .on() es un método que registra un evento en un objeto.
         * "finish" es el nombre del evento que se va a registrar.
         * () es una función anónima que se ejecuta cuando se dispara el evento.
         * resolve() es un método que resuelve una promesa.
         */

        // El evento "finish" se dispara cuando el stream de escritura(blobStream) se ha completado.
        // En este caso, el evento "finish" se dispara cuando la imagen redimensionada se ha escrito en el archivo blob.
        // La función que se pasa como argumento al método on() se ejecuta cuando se dispara el evento.
        // En este caso, la función se ejecuta cuando la imagen redimensionada se ha escrito en el archivo blob.
        // La función resuelve la promesa que se pasó como argumento al método upload().
        // En este caso, la promesa se resuelve cuando la imagen redimensionada se ha subido al bucket.


        // Registrar el evento "error"
        // Si ocurre algún error durante el proceso de subida de la imagen,
        // rechazamos la promesa con el error.
        blobStream.on("error", (err) => { reject(err); });


        // Escribe el buffer de la imagen en el blobStream para subirla al bucket.
        blobStream.end(resizedImageBuffer[index]);
        // blobStream es el objeto que representa el stream de escritura.
        // .end() es un método que finaliza el stream de escritura.
        // resizedImageBuffer[index] es el buffer de la imagen redimensionada.

      });
    });

    // Esperar a que se resuelvan todas las promesas de subida de imágenes.
    await Promise.all(promesasSubida);

    // Cuando todas las imágenes se hayan subido, redireccionar al cliente.
    res.redirect("/maquinaria/" + id_maquina);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al subir las imágenes.");
  }



});


module.exports = router;


// Middleware personalizado para limitar la cantidad de fotos
/*
const limitarCantidadFotos = (req, res, next) => {

  const maxAllowedPhotos = 5; // Número máximo de fotos permitidas

  // Verificar si hay archivos en la solicitud
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No se han encontrado fotos para subir.");
  }

  // Verificar la cantidad de fotos
  if (req.files.length > maxAllowedPhotos) {
    return res.status(400).send("Se ha excedido el número máximo de fotos permitidas.");
  }

  next();
};







// Se llama resizeImage, pero en realidad sólo hace que la foto esté en su mejor calidad.
async function resizeImage(buffers) {
  try {

    const resizedImages = await Promise.all(buffers.map(async (buffer) => {
      // Redimensionar cada imagen a un nuevo tamaño específico (por ejemplo, 800x600)
      const resizedImageBuffer = await sharp(buffer)
        .png({ quality: 100, chromaSubsampling: '4:4:4' }) // Adjust quality options as needed
        .toBuffer();

      return resizedImageBuffer;
    }));

    return resizedImages;
  } catch (err) {
    throw new Error('Error al redimensionar las imágenes.');
  }
}

*/