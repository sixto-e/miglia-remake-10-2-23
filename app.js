var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const hbs = require("hbs");


const { veryAdmin } = require("./middlewares/admin")
const { verificar_inicio_de_sesion } = require("./middlewares/logueado")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Clientes
const cargaClientesRouter = require('./routes/CLIENTES_/carga_clientes');

const clientesRouter = require('./routes/CLIENTES_/clientes');

const single_router = require("./routes/CLIENTES_/single");

const buscar_cliente = require("./routes/CLIENTES_/buscar_cliente")

// Maq
const crear_tipo_de_maquinaria_router = require("./routes/tipo_de_maquinarias/crear_tipo");

const tipos_de_maquinarias_router = require("./routes/tipo_de_maquinarias/tipos");

const editar_tipo_maquinaria = require("./routes/tipo_de_maquinarias/editar")

const crear_maquinaria_router = require("./routes/maquinarias/crear_maquinaria")

const listado_maquinarias_router = require("./routes/maquinarias/listado")

const single_maquinaria_router = require("./routes/maquinarias/single");

const buscar_maq_router = require("./routes/maquinarias/buscar");

const ficha_maquinaria_router = require("./routes/FICHAS_/ficha_maquinaria");

const cargar_foto_destacada_router = require("./routes/maquinarias/crear_foto_destacada");

const crear_galeria_router = require("./routes/maquinarias/crear_galeria")

// Usuarios

const cargar_usuario = require("./routes/USUARIOS_/carga_usuarios");
const usuarios = require("./routes/USUARIOS_/usuarios");
const user_router = require("./routes/USUARIOS_/user");
const editar_user = require("./routes/USUARIOS_/editar_user");
const login = require("./routes/LOGIN_/login");
const mi_perfil = require("./routes/USUARIOS_/mi_perfil");
const panel = require("./routes/PANEL/panel");
const logout = require("./routes/LOGUOT_/logout");

// Interacciones
const crear_interaccion_router = require("./routes/INTERACCIONES/crear_interaccion")
const interacciones_router = require("./routes/INTERACCIONES/interacciones");
const cantidad_inter_router = require("./routes/INTERACCIONES/cantidad_inter");
const intereaccion = require("./routes/INTERACCIONES/interaccion");
const tareas_router = require("./routes/INTERACCIONES/tareas")
const mis_interacciones_router = require("./routes/USUARIOS_/mis_interacciones")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// Para agregar vistas parciales como plantillas.
hbs.registerPartials(__dirname + '/views/_partials')


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de express-session
app.use(session({
  secret: 'pass secreto',
  cookie: { maxAge: null },
  resave: false,
  saveUninitialized: true
}));
// Fin de configuración

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/panel-de-control', panel);

// Clientes
app.use('/cargar-cliente', cargaClientesRouter);
app.use('/clientes', clientesRouter);
app.use("/cliente", single_router)
app.use("/buscar-cliente", buscar_cliente)

// Maq
app.use("/cargar-nuevo-tipo-maquinaria", crear_tipo_de_maquinaria_router);
app.use("/tipos-de-maquinarias", tipos_de_maquinarias_router);
app.use("/editar-tipo-maquinaria", editar_tipo_maquinaria);
app.use("/cargar-nueva-maquinaria", crear_maquinaria_router);
app.use("/maquinarias", listado_maquinarias_router);
app.use("/maquinaria", single_maquinaria_router);
app.use("/buscar-maquinaria", buscar_maq_router);
app.use("/ficha", ficha_maquinaria_router);
app.use("/cargar-foto-destacada", cargar_foto_destacada_router)
app.use("/crear-galeria", crear_galeria_router)
// Users
app.use("/cargar-usuario", cargar_usuario);
app.use("/usuarios", usuarios);
app.use("/usuario", user_router);
app.use("/editar-usuario", editar_user);
app.use("/login", login)
app.use("/mi-perfil", mi_perfil);
app.use("/logout", logout)
app.use("/mis-interacciones", mis_interacciones_router);

// Interacciones
app.use("/cargar-nueva-interaccion", crear_interaccion_router);
app.use("/interacciones", interacciones_router);
app.use("/obtener-cantidades", cantidad_inter_router);
app.use("/interaccion", intereaccion);
app.use("/tareas",  tareas_router);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
