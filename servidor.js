const express = require("express");
const app = express();
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const { newUser, getUsers, changeAuth, getUser } = require("./db");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(3000, () => console.log("servidor Levantado :D"));

const expressFileUpload = require("express-fileupload");
app.use(
  expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit:
      "el peso del archivo que intentas subir supera el limite permitido",
  })
);

app.set("view engine", "handlebars");

app.engine(
  "handlebars",
  hbs({
    layoutsDir: __dirname + "/views",
    partialsDir: __dirname + "/views/componentes/",
  })
);
//renderizacion
app.get("/", (req, res) => {
  res.render("Home", { layout: "Home" });
});

app.post("/usuario", async (req, res) => {
  const { email, nombre, password } = req.body;

  const respuesta = await newUser(email, nombre, password);

  res.send(respuesta);
});

app.get("/Admin", async (req, res) => {
  const respuesta = await getUsers();

  res.render("Admin", { layout: "Admin", data: respuesta });
});
app.post("/auth", async (req, res) => {
  const { id, auth } = req.body;
  try {
    const results = await changeAuth(id, auth);
    console.log(results);
    res.send(results);
  } catch (error) {
    console.log(error);
  }
});

//punto 3
const secretKey = "shhh";
app.get("/Login", (req, res) => {
  res.render("Login", { layout: "Login" });
});

app.post("/verify", async (req, res) => {
  const { email, password } = req.body;
  const user = await getUser(email, password);
  let token = user && user.auth ? jwt.sign(user, secretKey) : false;
  user
    ? user.auth
      ? res.redirect("/Evidencias?token=" + token)
      : res.send("Usted no está autorizado")
    : res.send("No existe este usuario en nuestra base de datos");

  res.send();
});

app.get("/Evidencias", (req, res) => {
  const { token } = req.query;

  jwt.verify(token, secretKey, (err, payload) => {
    err
      ? res.status(401).send({ error: "401 No Autorizado", message: err })
      : res.render("Evidencias", {
          layout: "Evidencias",
          nombre: payload.nombre,
        });
  });
});


app.post("/Upload", (req, res) => {
  const { foto } = req.files;
  const { name } = foto;
  foto.mv(`${__dirname}/imagenes/${name}`, (err) => {
     
       res.send('archivo subido con exito, Gracias por colaborar con la NASA')
      
  
  });
});