const express = require("express");
const Joi = require("@hapi/joi");
const ruta = express.Router();


const usuarios = [
    { id: 1, nombre: "José" },
    { id: 2, nombre: "Javier" },
    { id: 3, nombre: "Luis" },
    { id: 4, nombre: "Rodolfo" },
    { id: 5, nombre: "Merengue" }
  ];

ruta.get("/", (req, res) => {
  res.send(usuarios);
});

//variables de entorno, creamos variable de entorno PORT.
const port = process.env.PORT || 3000;

//rutas par solicitar parametros.
//con los dos puntos :id se le indica que es un parametro introducido.
ruta.get("/:id", (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) res.status(404).send("El usuairo no fue encontrado");
  res.send(usuario);
});

//envío de datos POST
ruta.post("/", (req, res) => {
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
ruta.put("/:id", (req, res) => {
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

ruta.delete("/:id", (req, res) => {
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

//exportamos las rutas
module.exports = ruta;