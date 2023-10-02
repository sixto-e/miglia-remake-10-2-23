// Selecciono todos los inputs
const inputs = document.querySelectorAll(".move");

// Desactivo los inputs
inputs.forEach((input) => {

    input.disabled = true;
})


// Botón "Aplicar cambios"
const btn_aplicar_cambios = document.getElementById("btn-save");
btn_aplicar_cambios.style.display = "none";

// Botón "Cancelar edición"
const btn_cancelar = document.getElementById("btn-cancel-editor");
// Lo desactivo
btn_cancelar.style.display = "none";

// Botón "Editar edición"
const btn_editar = document.getElementById("btn-editor");

const editar_pass = document.getElementById("btn-editar-pass");


// Toco el botón editar
btn_editar.addEventListener("click", () => {
    // Habilito todo los inputs
    inputs.forEach((input) => {
        input.disabled = false;
    })
    // Botón "Aplicar cambios" activado
    btn_aplicar_cambios.style.display = "block";
    btn_editar.style.display = "none"
    editar_pass.style.display = "none"
    // Botón "Cancelar edición" activo
    btn_cancelar.style.display = "block";
})

// Toco el botón btn_cancelar
btn_cancelar.addEventListener("click", () => {
  // Recargar la página actual
  location.reload();
})