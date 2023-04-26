//ya tenemos iniciados el requerimiento para trabajar ocn express.
//entornos de depuración
const debug = require("debug")("app:inicio");
//const dbDebug = require('debug')('app:db');
const express = require("express");
const config = require("config");
//const logger = require('./logger');
const morgan = require("morgan");
const usuarios = require('./routes/usuarios');
//instancia de express.
const app = express();

//los metodos siguientes se ejecutan antes de llamar a la funcion ruta.
app.use(express.json()); //evaluamos el body. express.json funcion middleware.
//actualmente se envia así los datos body var1=valor&var2=valor&...
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/api/usuarios', usuarios);//se redirije a usuarios.js.

//Configuración de entornos
console.log("Aplicación: " + config.get("nombre"));
console.log("BD server: " + config.get("configDB.host"));

//uso de middleware de tercero - Morgan. Mostrar tiempo de respuesta sel servidor y mas datos.
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  //console.log('Morgan habilitado.')
  debug("Morgan está habilitado.");
}

// app.use(logger); //funcion middleware
// app.use(function(req,res, next){
//   console.log('Autenticando...');
//   next();
// })



//metodos y cada metodo tiene una ruta asignada
//petición, response para dar respuesta al cliente, y send para enviar informacion al cliente.
app.get("/", (req, res) => {
  res.send("Hola Mundo desde Express.");
});

//hay que indicarle que puerto va escuchar el servidor web
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}...`);
});

//trabajos con la base d datos.
debug("Conectando con la base de datos");

// //validacion sencilla de datos
// if(!req.body.nombre || req.body.nombre.length <= 2) {
//     //400 Bad Request
//     res.status(400).send('Debe ingresar un nombre, que tenga mínimo 3 letras.');
//     return;
//}
