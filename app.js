//ya tenemos iniciados el requerimiento para trabajar ocn express.
//entornos de depuración
const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express = require("express");
const config = require('config');
//const logger = require('./logger');
const morgan = require('morgan');
const Joi = require("@hapi/joi");
//instancia de express.
const app = express();

//los metodos siguientes se ejecutan antes de llamar a la funcion ruta.
app.use(express.json()); //evaluamos el body. express.json funcion middleware.
//actualmente se envia así los datos body var1=valor&var2=valor&...
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

//Configuración de entornos
console.log('Aplicación: ' +config.get('nombre'));
console.log('BD server: ' +config.get('configDB.host'));


//uso de middleware de tercero - Morgan. Mostrar tiempo de respuesta sel servidor y mas datos.
if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  //console.log('Morgan habilitado.')
  debug('Morgan está habilitado.');
}


// app.use(logger); //funcion middleware
// app.use(function(req,res, next){
//   console.log('Autenticando...');
//   next();
// })

const usuarios = [
  { id: 1, nombre: "José" },
  { id: 2, nombre: "Javier" },
  { id: 3, nombre: "Luis" },
];

//metodos y cada metodo tiene una ruta asignada
//petición, response para dar respuesta al cliente, y send para enviar informacion al cliente.
app.get("/", (req, res) => {
  res.send("Hola Mundo desde Express.");
});

app.get("/api/usuarios", (req, res) => {
  res.send(usuarios);
});

//variables de entorno, creamos variable de entorno PORT.
const port = process.env.PORT || 3000;

//rutas par solicitar parametros.
//con los dos puntos :id se le indica que es un parametro introducido.
app.get("/api/usuarios/:id", (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) res.status(404).send("El usuairo no fue encontrado");
  res.send(usuario);
});

//hay que indicarle que puerto va escuchar el servidor web
app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}...`);
});

//envío de datos POST
app.post("/api/usuarios", (req, res) => {
  //validacion con Joi
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
  });
  const { error, value } = validarUsuario(req.body.nombre);
  if (!error) {
    //Sí no da error, se añade el usuario.
    const usuario = {
      id: usuarios.length + 1,
      nombre: value,
    };
    usuarios.push(usuario);
    res.send(usuario);
  } else {
    //mostrar el error
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);
  }
});

//actualización
app.put("/api/usuarios/:id", (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send("El usuairo no fue encontrado");
    return;
  }

  const { error, value } = validarUsuario(req.body.nombre);
  if (error) {
    //mostrar el error
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);
    return; //se corta la compilación.
  }

  usuario.nombre = value.nombre;
  res.send(usuario);
});

app.delete("/api/usuarios/:id", (req, res) => {
    let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send("El usuairo no fue encontrado");
    return;
  }

  //definir el indice del usuairo encontrado para eliminarlo posteirormente.
  const index = usuarios.indexOf(usuario);
  usuarios.splice(index, 1);

  res.send(usuarios);
});


//Funciones
function existeUsuario(id) {
  return usuarios.find((u) => u.id === parseInt(id));
}

function validarUsuario(nom) {
  //validar si el dato es correcto, igual que la validacion del post.
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
  });
  return schema.validate({ nombre: nom });
}

//trabajos con la base d datos.
debug('Conectando con la base de datos');



// //validacion sencilla de datos
// if(!req.body.nombre || req.body.nombre.length <= 2) {
//     //400 Bad Request
//     res.status(400).send('Debe ingresar un nombre, que tenga mínimo 3 letras.');
//     return;
//}
