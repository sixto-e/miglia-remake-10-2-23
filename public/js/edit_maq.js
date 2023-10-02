// Tomo todos los campos
var inputs = document.querySelectorAll(".form-control");
inputs.forEach((input) => {
  // Los desactivo
  input.disabled = true;
  input.setAttribute("style", "background-color:#fff;");
})


// Tomo el botón crear galeria 
btn_galeria = document.getElementById("btn-galeria")

// Tomo el botón editar foto
var btn_editar_foto = document.getElementById("btn-editar-foto")

// Tomo el botón editar
var editar_boton = document.getElementById("btn-editar");

// Tomo el botón guardar
var boton_save = document.getElementById("btn-save");
// Desaparece el botón guardar
boton_save.style.display = "none"

// Tomo el botón cancelar
var cancel_boton = document.getElementById("btn-cancel");
// Desaparece el botón cancelar
cancel_boton.style.display = "none"

// Tomo el botón de copiar enlace
var btn_enlace = document.getElementById("botonCopiar");

// Cuando tocan Botón editar
editar_boton.addEventListener("click", () => {
  // 1 -  habilitos los campos
  inputs.forEach((input) => {
    input.disabled = false;
    input.setAttribute("style", "background-color:#fff;");
  })


  // Desaparece el botón editar
  editar_boton.style.display = "none"
  // Desaparece el botón crear galeria
  btn_galeria.style.display = "none"
  // Desaparece el botón para copiar enlace
  btn_enlace.style.display = "none"
  // Aparece el botón cancelar
  cancel_boton.style.display = "block"
  // Aparece el botón guardar
  boton_save.style.display = "block"
  // Desaparece
  btn_editar_foto.style.display = "none"

})

// Cuando tocan Botón cancelar
cancel_boton.addEventListener("click", () => {
  // 1 - Deshabilitos los campos
  inputs.forEach((input) => {
    input.disabled = true;
    input.setAttribute("style", "background-color:#fff;");
  })
  // Activo botón editar
  editar_boton.style.display = "block"

  // DesActivo boton cancelar
  cancel_boton.style.display = "none"

  // Desaparece boton_save
  boton_save.style.display = "none"

  // Aparece el botón para copiar enlace
  btn_enlace.style.display = "block"

  // Aparece
  btn_editar_foto.style.display = "block"

  
  // Aparece
  btn_galeria.style.display = "block"



})
