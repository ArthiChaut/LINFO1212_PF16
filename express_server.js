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
const function_extension = require('./function_extention');
let beforelog = false;


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
app.post('/login', function(req,res) {
 
  const {username, password} = req.body;
  function_extension.countExist(username).then(result => {
    if( result ===  false){
      console.log("Le compte n'existe pas encore");
      res.redirect("/login");
      
    }else{
      console.log("Le compte existe");
      function_extension.passwordCorrect(username, password).then(result => {
        if(result != false){
          console.log("Mot de passe correct");
          req.session.username = result.username;
          req.session.completeName = result.completeName;
          req.session.email = result.email;
          req.session.credits = result.credits;
          
          if(beforelog){
            res.redirect("/vente");
          } else {
            res.redirect("/");
          }
        } else {
          console.log("Mot de passe incorrect");
          res.redirect("/login");
        }
      })

    }
  });  
})


app.post('/register', function(req,res) {
  const {name, username,email, password, confirmedPassword} = req.body;
  function_extension.countExistForCreate(username, email).then(result => {
    if(result){
      res.redirect('/register');
    } else {
      let result2 = function_extension.validate(email);
      if(result2){
        let goodConfirmPassword = function_extension.passwordConfirm(password, confirmedPassword);
        if(goodConfirmPassword){
          User.create({
            credits: 0,
            completeName:req.body.name,
            username:req.body.username,
            email:req.body.email,
            password:bcrypt.hashSync(req.body.password,10)}).then(()=>
            res.redirect('/login'));
        } else {
          console.log("Mots de passe non similaire");
          res.redirect('/register');
        }
      } else {
        res.redirect('/register');
      }
      
    }
  });
})

app.post('/vente',upload.single('image'), function(req, res) {
  const {Marque,Prix,Matiere,Couleur,Etat,Localisation} = req.body;
  Clothes.create({
    image:req.imagePath,
    marque:Marque,
    prix:Prix,
    matiere:Matiere,
    couleur:Couleur,
    etat:Etat,
    localisation: Localisation,
    user:req.session.username,
    sold:false
    }) 
  });
  

//get request to the root path  
app.get("/", (req, res) => {
  if(req.session.username){
    res.render('pages/main', {username: req.session.username,
      credits: "Crédits: " + req.session.credits});
  } else {
    res.render("pages/main", {username: "Se connecter", credits: ""});
  }
  
});

app.get('/login', function(req,res) {
  if(req.session.username){
    res.redirect('/profil');
  } else {
    res.render("pages/login", {username: "Se connecter", credits: ""});
  }
});

app.get('/register', function(req,res) {
  if(req.session.username){
    res.render('pages/register', {username: req.session.username,
      credits: "Crédits: " + req.session.credits});
  } else {
    res.render("pages/register", {username: "Se connecter", credits: ""});
  }
});

app.get('/panier', function(req,res) {
  if(req.session.username){
    res.render('pages/panier', {username: req.session.username,
      credits: "Crédits: " + req.session.credits});
  } else {
    beforelog = "panier";
    res.redirect("/login");
  }
});

app.get('/profil', function(req,res) {
  
  res.render('pages/profil', {username: req.session.username,
  completeName: req.session.completeName,
  email: req.session.email,
  credits: "Crédits: " + req.session.credits});
});

app.get('/vente',  function(req,res) {
  if(req.session.username){
    res.render('pages/sellClothes', {username: req.session.username,
      credits: "Crédits: " + req.session.credits});
  } else {
    beforelog = "vente";
    res.redirect("/login");
  }
});

app.get('/info', function(req,res) {
  if(req.session.username){
    res.render('pages/clothesInfos', {username: req.session.username,
      credits: "Crédits: " + req.session.credits});
  } else {
    res.render("pages/clothesInfos", {username: "Se connecter", credits: ""});
  }
});



https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'pf16'
}, app).listen(PORT, () => {
  console.log(`Site lancé sur le port ${PORT}!`)
});


