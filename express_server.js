const express = require("express");
const sequelize = require('./database');
const session = require('express-session');
const app = express();
const path = require('path');
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const https = require('https');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const { User,Clothes } = require("./models");


const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,'Images')
  },
  filename: (req,file,cb)=>{
    req.imagePath = Date.now() + path.extname(file.originalname);
    cb(null,Date.now() + path.extname(file.originalname))
  }
  
})

const upload = multer({storage: storage})


sequelize.sync().then(() => console.log("Database ready!"))
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: "bumpbpf16",
  resave: false,
  saveUninitialized: true,
  cookie: { 
    path: '/', 
    httpOnly: true, 
    maxAge: 3600000
  }
}));


app.use('/static',express.static('static'));
app.set('view engine', 'ejs');

//post request
app.post('/login', function(req, res) {
  const {username, password} = req.body;
  //console.log(function_extension.countExist(username));
  function_extension.countExist(username).then(result => {
    if( result ===  true){
      console.log("Le compte existe");
    }else{
      console.log("Le compte n'existe pas encore");
    }
  })
})

app.post('/register', function(req, res) {
  const {name,username,email,password} = req.body;

  User.create({
    completeName:req.body.name,
    username:req.body.username,
    email:req.body.email,
    localisation:req.body.localisation,
    password:bcrypt.hashSync(req.body.password,10)}).then(()=>
    res.redirect('/login'));

});

app.post('/vente',upload.single('image'), function(req, res) {
  const {Marque,Prix,Matiere,Couleur,Etat,Localisation} = req.body;
  Clothes.create({
    image:req.imagePath,
    marque:Marque,
    prix:Prix,
    matiere:Matiere,
    couleur:Couleur,
    etat:Etat,
    user:"velkiz",
    sold:false
    }) 
  });
  

//get request to the root path  
app.get("/", (req, res) => {
  res.render("pages/main")
});

app.get('/login', function(req,res) {
  res.render('pages/login')
});

app.get('/register', function(req,res) {
  res.render('pages/register')
});

app.get('/panier', function(req,res) {
  res.render('pages/panier')
});

app.get('/profil', function(req,res) {
  res.render('pages/profil')
});

app.get('/vente', function(req,res) {
  res.render('pages/sellClothes')
});

app.get('/info', function(req,res) {
  res.render('pages/clothesInfos')
});



https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'pf16'
}, app).listen(PORT, () => {
  console.log(`Site lancé sur le port ${PORT}!`)
});


