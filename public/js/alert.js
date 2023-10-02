document.getElementById("botonCopiar").addEventListener("click", function () {
  // Obtén el enlace
  var enlace = document.getElementById("enlace").href;

  // Intenta copiar el texto al portapapeles
  navigator.clipboard.writeText(enlace)
    .then(function () {
      // Éxito al copiar
      var alertaEnlaceCopiado = document.getElementById("alertaEnlaceCopiado");
      alertaEnlaceCopiado.style.display = "block";

      // Oculta la alerta después de unos segundos (puedes ajustar el tiempo si lo deseas)
      setTimeout(function () {
        alertaEnlaceCopiado.style.display = "none";
      }, 3000); // 3000 milisegundos = 3 segundos, ajusta según tus preferencias
    })
    .catch(function (err) {
      // Manejo de errores si la copia al portapapeles falla
      console.error("Error al copiar al portapapeles:", err);
    });
});
