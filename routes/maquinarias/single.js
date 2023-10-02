var express = require('express');
var router = express.Router();

// Datos necesarios para acceder a mi proyecto de Google Cloud
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ projectId: 'principal-rope-394117', keyFilename: 'principal-rope-394117-50edf592e5aa.json' });
const bucket = storage.bucket('examplepoi');



const { fotosGaleria, single_maquinaria, borrar_habilitar_maq, listado_tipo_maquinarias, seleccionar_modalidad, seleccionar_estado, seleccionar_disponibilidad, editar_maquinaria } = require("../../models/consulta");


// Obtiene la URL pública para una sóla foto.
async function getPublicUrlForPhoto(photoName) {
	try {
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
			// Si el nombre de la foto no existe, devolvemos null
			// console.warn(`La foto con nombre ${photoName} no existe en Google Cloud Storage.`);
			return null;
		}
	} catch (error) {
		console.error('Error al obtener la URL pública:', error);
		return null; // Devolvemos null si ocurre algún error
	}
}


// Obtiene las url públicas para las fotos de la galería.
const getPublicUrlGallery = async (cloneNamesPhotosGallery) => {
	// La variable "urls" guarda las urls públicas.
	const urls = await Promise.all(

		cloneNamesPhotosGallery.map(async (photoName) => {

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
				return null;
			}
		})
	);
	// Devolvemos la lista de URLs públicas.
	return urls;
}




const single_maq_activa = async (req, res) => {

	var id, urls_galeria, referencia_foto, url_foto, fotos_galeria;
	// ID de la maquinaria
	id = req.params.id;
	const estado = true;
	// TIPOS MAQ
	const tipos_maq = await listado_tipo_maquinarias(estado);
	// console.log("tipos_maq: ", tipos_maq);
	// MODALID MAQ
	const modalidad = await seleccionar_modalidad();
	// console.log("modalidad: ", modalidad);
	// ESTADO MAQ
	const estado_maq = await seleccionar_estado();
	// console.log("estado_maq: ", estado_maq);
	// DISPONIB. MAQ
	const disponib = await seleccionar_disponibilidad();
	//console.log("disponib: ", disponib);
	const maquina = await single_maquinaria(id, estado)
	// console.log("maquina :", maquina);
	if (maquina.length > 0) {
		// Referencia de foto destacada
		referencia_foto = maquina[0]['foto'];
		// URL de la foto destacada obtenida.
		url_foto = await getPublicUrlForPhoto(referencia_foto);
		// console.log("url_foto: ", url_foto);
		fotos_galeria = await fotosGaleria(id)
		//console.log("fotos_galeria: ", fotos_galeria);
		// Creo array con los nombres de las fotos. Sin propiedades.
		const cloneNamesPhotosGallery = fotos_galeria.map(foto => foto.referencia);
		// Usar await dentro de una función async: incluso si getPublicUrlGallery() es una promesa.
		// URLS públicas obtenidas.
		urls_galeria = await getPublicUrlGallery(cloneNamesPhotosGallery);
		// console.log("urls galeria: ", urls_galeria);
	}

	res.render("MAQ/single_maq", { urls_galeria, url_foto, maquina, estado, tipos_maq, modalidad, estado_maq, disponib })
}

router.get("/:id", single_maq_activa)


const editar_maquinaria_habilitada = async (req, res) => {
	try {
		// Data nueva
		const nueva_data = req.body;
		//console.log("nueva_data: ", nueva_data);
		// Id de la maq
		const id_maq = req.params.id;
		//console.log("id_maq: ", id_maq);
		// Modifico los datos
		const data_modificada = await editar_maquinaria(nueva_data, id_maq)
		// console.log("datos modificados: ", data_modificada);
		res.redirect("/maquinaria/" + id_maq)
	} catch (e) {
		console.log(e);
	}
}

router.post("/:id/modificar-datos/create", editar_maquinaria_habilitada)


const single_maq_borrada = async (req, res) => {
	const id = req.params.id;
	const estado = false;
	const maquina = await single_maquinaria(id, estado)
	// console.log("maquina :", maquina);
	res.render("MAQ/single_maq", { maquina, estado })
}

router.get("/borrada/:id", single_maq_borrada)

const borrar = async (req, res) => {
	const id = req.params.id;
	const estado = false;
	const maq_borrada = await borrar_habilitar_maq(estado, id);
	console.log(maq_borrada);
	res.redirect("/maquinarias")
}

router.get("/borrar/:id", borrar)

const habilitar = async (req, res) => {
	const id = req.params.id;
	const estado = true;
	const maq_borrada = await borrar_habilitar_maq(estado, id);
	console.log(maq_borrada);
	res.redirect("/maquinarias")
}
router.get("/habilitar/:id", habilitar)

module.exports = router;
