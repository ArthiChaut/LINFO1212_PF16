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
const cookieParser = require('cookie-parser');
const function_extension = require('./function_extension');
let beforelog = false;
let clothes = [];
let listClothesByMe = [];
let clothesAllAffichage = [];
let array = [];

const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,'static/IMAGES')
  },
  filename: (req,file,cb)=>{
    req.imagePath = Date.now() + path.extname(file.originalname);
    cb(null,Date.now() + path.extname(file.originalname))
  }
  
})

const upload = multer({storage: storage})


sequelize.sync().then(() => console.log("Database ready!"))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
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

app.use(cookieParser());
app.use('/static',express.static('static'));
app.set('view engine', 'ejs');

//post request
app.post('/login', function(req,res) {
 
  const {username, password} = req.body;
  function_extension.countExist(username).then(result => {
    if( result ===  false){
      console.log("Le compte n'existe pas encore");
      res.render("pages/login",{error_message_email: "Nom d'utilisateur ou e-mail incorrect", error_message_password: "", username: "Se connecter", credits: "" });
      
    }else{
      console.log("Le compte existe");
      function_extension.passwordCorrect(username, password).then(result => {
        if(result != false){
          console.log("Mot de passe correct");
          req.session.username = result.username;
          req.session.completeName = result.completeName;
          req.session.email = result.email;
          req.session.credits = result.credits;
          req.session.localisation = result.localisation;
          
          
          switch(beforelog){
            case 'vente':
              res.redirect("/vente");
              break;
            case 'panier':
              res.redirect("/panier");
              break;
            default:
              res.redirect("/");
          }
          /*
          if(beforelog){
            res.redirect("/vente");
          } else {
            res.redirect("/");
          }
          */
        } else {
          console.log("Mot de passe incorrect");
          res.render("pages/login", {error_message_password: "Mot de passe incorrect", error_message_email: "", username: "Se connecter", credits: ""});
        }
      })

    }
  });  
})


app.post('/register', function(req,res) {
  const {name, username,email, password, confirmedPassword} = req.body;
  function_extension.countExistForCreate(username, email).then(result => {
    if(result){
      res.render('pages/register', {username: "Se connecter", credits: "", error_message_password: "", error_message_email: "", error_message_account : "Nom d'utilisateur et/ou e-mail déjà utilisé(s)"});
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
            localisation:req.body.localisation,
            password:bcrypt.hashSync(req.body.password,10)}).then(()=>
            res.redirect('/login'));
        } else {
          console.log("Mots de passe non similaire");
          res.render('pages/register', {username: "Se connecter", credits: "", error_message_account : "" ,error_message_password: "Les mots de passe ne sont pas similaires", error_message_email: ""});
        }
      } else {
        res.render('pages/register', {username: "Se connecter", credits: "", error_message_account : "" , error_message_email: "L'adresse e-mail n'est pas valide", error_message_password: ""});
      }
      
    }
  });
})

app.post('/vente',upload.single('image'), function(req, res) {
  const {Type,Marque,Prix,Couleur,Taille,Genre,Etat} = req.body;

    Clothes.create({
    image:"static/IMAGES/"+req.imagePath,
    type:Type,
    marque:Marque,
    prix:Prix,
    couleur:Couleur,
    taille:Taille,
    genre:Genre,
    etat:Etat,
    user:req.session.username,
    sold:false
    }) 
  });

app.post('/clothes', async (req, res) =>{
    const sizeFilter = req.body.sizeFilter;
    const colorFilter = req.body.colorFilter;
    const products = await function_extension.rechercherProduits(sizeFilter, colorFilter,array);
    console.log(sizeFilter);
    console.log(colorFilter);
    console.log(products);
    res.render('pages/clothesAll', { username: req.session.username,
        completeName: req.session.completeName,
        email: req.session.email,
        creditsProfil: req.session.credits,
        credits: "Crédits: " + req.session.credits,
        clothes: array,
      }); // render the page with the filtered clothes
});
  

//get request to the root path  
app.get("/", function(req, res) {
  function_extension.fourLastInstances(Clothes,clothes).then(clothes => {
    if(req.session.username){
      res.render('pages/main', {username: req.session.username,
        credits: "Crédits: " + req.session.credits, clothes:clothes});
    } else {
      res.render("pages/main", {username: "Se connecter", credits: "", clothes:clothes});
    }
  })
  
});

app.get('/login', function(req,res) {
  if(req.session.username){
    res.redirect('/profil');
  } else {
    res.render("pages/login", {username: "Se connecter", credits: "", error_message_email: "", error_message_password: ""});
  }
});

app.get('/register', function(req,res) {
    res.render("pages/register", {username: "Se connecter", credits: "",error_message_account : "" , error_message_password: "", error_message_email: ""});
});

app.get('/panier', function(req,res) {
  if(req.session.username){
    res.render('pages/panier', {username: req.session.username,
      credits: "Crédits: " + req.session.credits});
  } else {
    beforelog = "panier";
    res.render("pages/login", {username: "Se connecter", credits: "", error_message_email: "", error_message_password: ""});
  }
});

app.get('/profil', function(req,res) {
  function_extension.clothesByMe(Clothes, req.session.username).then( result => {
    res.render('pages/profil', {username: req.session.username,
      completeName: req.session.completeName,
      email: req.session.email,
      creditsProfil: req.session.credits,
      credits: "Crédits: " + req.session.credits,
      localisation: req.session.localisation,
      listClothesByMe:result});
      //console.log(result);
  })
})

app.get('/clothes', function(req,res) {
  if(req.session.username){
    function_extension.displayClothes(clothesAllAffichage)
    res.render('pages/clothesAll', {
      username: req.session.username,
      credits: "Crédits: " + req.session.credits,
      completeName: req.session.completeName,
      email: req.session.email,
      creditsProfil: req.session.credits,
      clothes:clothesAllAffichage
    });
  } else {
    res.render("pages/login", {username: "Se connecter", credits: "",error_message_email: "", error_message_password: "" });
    };
});
  

  


app.get('/vente',  function(req,res) {
  if(req.session.username){
    res.render('pages/sellClothes', {username: req.session.username,
      credits: "Crédits: " + req.session.credits});
  } else {
    beforelog = "vente";
    res.render("pages/login", {username: "Se connecter", credits: "", error_message_email: "", error_message_password: ""});
  }
});

app.get('/info', function(req,res) {
  const {image,marque,prix,couleur,taille,genre,date,etat,user} = req.query;
  function_extension.getUserLocation(user).then(localisation => {
    if(req.session.username){
      res.render('pages/clothesInfos', {username: req.session.username,
        credits: "Crédits: " + req.session.credits,image:image,marque:marque,prix:prix,couleur:couleur,taille:taille,genre:genre,date:date,etat:etat,user:user,localisation:localisation});
    } else {
      res.render("pages/clothesInfos", {username: "Se connecter", credits: "",image:image,marque:marque,prix:prix,couleur:couleur,taille:taille,genre:genre,date:date,etat:etat,user:user,localisation:localisation});
    }

  })
  
});

https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'pf16'
}, app).listen(PORT, () => {
  console.log(`Site lancé sur le port ${PORT}!`)
});


