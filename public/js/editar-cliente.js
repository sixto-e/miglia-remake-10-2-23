var noCommaDotInputs = document.querySelectorAll('.no-comma-dot');

noCommaDotInputs.forEach(function (input) {
  input.addEventListener('keydown', function (event) {
    if (event.key === ',' || event.key === "-" || event.key === '.') {
      event.preventDefault();
    }
  });
});

// Agarro el boton salir de edición
var btn_cancel = document.getElementById("btn-cancelar-editor");
// Lo hago desaparecer
btn_cancel.style.display = "none";
// Agarro el botón editar
var boton_editar = document.getElementById("btn-editar");
// Agarro el botón aplicar cambios
var boton_save = document.getElementById("btn-save");
// Hago desaparecer el boton  aplicar cambios
boton_save.style.display = "none";
// Agarro todos los inputs
var inputs = document.querySelectorAll(".muted");

inputs.forEach((input) => {
  // Deshabilito todos los campos
  input.disabled = true;
})

// Cuando toco el boton editar: {}
boton_editar.addEventListener("click", () => {
  inputs.forEach((input) => {
    // Habilito todos los campos
    input.disabled = false;
  })

  // Muestro el botón aplicar cambios
  boton_save.style.display = "block";
  boton_editar.style.display = "none"
  btn_cancel.style.display = "block"

})


// Cuando toco el boton cancelar: {}

btn_cancel.addEventListener("click", () => {
  inputs.forEach((input) => {
    // Deshabilito todos los campos
    input.disabled = true;
  })

  // NO Muestro el botón aplicar cambios
  boton_save.style.display = "none";
  // Muestra editar boton
  boton_editar.style.display = "block"
  // No muestro boton cancel
  btn_cancel.style.display = "none"

})

