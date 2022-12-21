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
let filtre ="";

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
    maxAge:36000000000
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
      res.render("pages/login",{error_message_email: "Nom d'utilisateur ou e-mail incorrect", error_message_password: "", username: "Se connecter", credits: "" });
      
    }else{
      function_extension.passwordCorrect(username, password).then(result => {
        if(result != false){
          function_extension.setupSession(result,req.session);
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
      if(function_extension.validate(email)){
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
  if(function_extension.checkPrice(Prix)){
    Clothes.create({
      image:"static/IMAGES/"+req.imagePath,
      type:Type,
      marque:Marque.toLowerCase(),
      prix:Prix,
      couleur:Couleur,
      taille:Taille,
      genre:Genre,
      etat:Etat,
      user:req.session.username,
      sold:false
      }).then(() => res.redirect('/'))
  }else{
    res.render('pages/sellClothes',{username:req.session.username,credits:"Crédits:" + req.session.credits,error_message_prix:"prix non valide"})
  }
  
  
});
app.post('/panier', function(req, res) {
  let totalPanier = function_extension.getPanierTotal(req.session.panier);
  if(totalPanier <= req.session.credits){
    function_extension.removeArticles(req.session.panier).then(() => {
      req.session.credits -= totalPanier;
      function_extension.changeCredit(0 - totalPanier,req.session.username)
      function_extension.updateAllCredits(req.session.panier);
      req.session.panier = [];
      setTimeout(function() {res.redirect('/')},4000);
    })
  }else{
    res.redirect('/panier')
  }
  
  
});

app.post('/modifArticle', upload.single('image'), function(req, res) {

  //console.log(req.session.image);
  const{Type, Marque, Prix, Couleur, Taille, Genre, Etat} = req.body;
  //console.log("static/IMAGES/" + req.imagePath);
  let listModif = ["static/IMAGES/" + req.imagePath,Type, Marque, Prix, Couleur, Taille, Genre, Etat];
  function_extension.changeVetement(listModif, req.session.idClothes);
  res.redirect('/profil');
  
})

app.post('/profil', upload.single('image'), function(req, res) { 
    const{Crédits} = req.body;
    username = req.session.username;
    if(Crédits){
    function_extension.changeCredit(Crédits, username);
      req.session.credits += parseInt(Crédits);
      res.redirect('/profil');
  } else {
    function_extension.changePP(req.imagePath, username).then( result => {
      req.session.image = result;
      res.redirect('/profil');
    })
    
  }
  
  
})

app.post('/vetements', function(req, res){
  const {couleur,taille,genre, type,etat } = req.body;

  function_extension.rechercherProduits(taille, couleur,genre,type,etat).then(result => {
    if(req.session.username){
      res.render('pages/clothesAll', { username: req.session.username,
                                       credits: "Crédits: " + req.session.credits,
                                       clothes: result
      }); // render the page with the filtered clothes
    }else{
      res.render('pages/clothesAll', { username: "Se connecter",
                                       credits: "",
                                       clothes: result
                                      });
    }
    
  })
  
});

app.post("/disconnect", function(req, res){
  req.session.destroy();
  res.redirect("/");
})

//get request to the root path  
app.get("/", function(req, res) {
  function_extension.fiveLastInstances(Clothes,clothes).then(clothes => {
    function_extension.getLatestSells(req.session.username).then(sells => {
    if(req.session.username){
      res.render('pages/main', {username: req.session.username,
        credits: "Crédits: " + req.session.credits, clothes:clothes,sells:sells});
    } else {
      res.render("pages/main", {username: "Se connecter", credits: "", clothes:clothes,sells:sells});
    }

    })
    
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
  const{image,marque,prix,etat,couleur,user}=req.query;

  if(req.session.panier.length == 0 && image || image && req.session.panier[req.session.panier.length-1].Image != image){
  req.session.panier.push({
    Image:image,
    Marque:marque,
    Prix: parseInt(prix),
    Etat: etat,
    Couleur:couleur,
    User:user
  });
}

  let totalPanier = function_extension.getPanierTotal(req.session.panier);
    res.render('pages/panier', {username: req.session.username,
      credits: "Crédits: " + req.session.credits,image:image,marque:marque,prix:prix,etat:etat,couleur:couleur,user:user,clothes:req.session.panier,nombreArticles:req.session.panier.length,totalPanier:totalPanier,creditsForm:req.session.credits});
  } else {
    beforelog = "";
    res.redirect('/login');
  }
});


app.get('/profil', function(req,res) {
  function_extension.clothesByMe(Clothes, req.session.username).then(result => {
    console.log(req.session.image);
    res.render('pages/profil', {username: req.session.username,
      image: req.session.image,
      completeName: req.session.completeName,
      email: req.session.email,
      creditsProfil: req.session.credits,
      credits: "Crédits: " + req.session.credits,
      localisation: req.session.localisation,
      listClothesByMe:result});
  })
})

app.get('/vetements', function(req, res){
  const {couleur,taille,genre, type,etat } = req.body;
  
  function_extension.rechercherProduits(taille, couleur,genre,type,etat).then(result => {
    if(req.session.username){
      res.render('pages/clothesAll', { username: req.session.username,
        credits: "Crédits: " + req.session.credits,
        clothes: result
      }); // render the page with the filtered clothes

    }else{
      res.render('pages/clothesAll', { username: "Se connecter",
        credits: "",
        clothes: result
      });
    }

  })
  
});

app.get('/vetements/homme', function(req,res) {
    filtre = "Homme";
    function_extension.displayClothes(filtre).then(result =>{
      if(req.session.username){
        res.render('pages/clothesAll', {
          username: req.session.username,
          credits: "Crédits: " + req.session.credits,
          clothes:result
        })
      }else{
        res.render('pages/clothesAll', {
          username: "Se connecter",
          credits: "",  
          clothes:result
        })
      }
    })
});

app.get('/vetements/femme', function(req,res) {
  filtre = "Femme";
  function_extension.displayClothes(filtre).then(result =>{
    if(req.session.username){
      res.render('pages/clothesAll', {
        username: req.session.username,
        credits: "Crédits: " + req.session.credits,
        clothes:result
      })
    }else{
      res.render('pages/clothesAll', {
        username: "Se connecter",
        credits: "",  
        clothes:result
      })
    }
    
  })
});

app.get('/vetements/enfant', function(req,res) {
  filtre = "Enfant";
  function_extension.displayClothes(filtre).then(result =>{
    if(req.session.username){
      res.render('pages/clothesAll', {
        username: req.session.username,
        credits: "Crédits: " + req.session.credits,
        clothes:result
      })
    }else{
      res.render('pages/clothesAll', {
        username: "Se connecter",
        credits: "",  
        clothes:result
      })
    }
  })
});


app.get('/vente',  function(req,res) {
  if(req.session.username){
    res.render('pages/sellClothes', {username: req.session.username,
      credits: "Crédits: " + req.session.credits,error_message_prix:""});
  } else {
    beforelog = "vente";
    res.redirect('/login');
  }
});

app.get('/info', function(req,res) {
  const {image,type,marque,prix,couleur,taille,genre,date,etat,user} = req.query;
  function_extension.getUserLocation(user).then(localisation => {
    if(req.session.username === user){
      res.render('pages/clothesInfos', {username: req.session.username,
        credits: "Crédits: " + req.session.credits,image:image,type:type,marque:marque,prix:prix,couleur:couleur,taille:taille,genre:genre,date:date,etat:etat,user:user,localisation:localisation,showButton:false});
    } else if (!req.session.username) {
      res.render("pages/clothesInfos", {username: "Se connecter", credits: "",image:image,type:type,marque:marque,prix:prix,couleur:couleur,taille:taille,genre:genre,date:date,etat:etat,user:user,localisation:localisation,showButton:true});
    }else{
      res.render("pages/clothesInfos", {username: req.session.username, credits: "",image:image,type:type,marque:marque,prix:prix,couleur:couleur,taille:taille,genre:genre,date:date,etat:etat,user:user,localisation:localisation,showButton:true});
    }

  })
  
});








app.get('/modifArticle', function(req, res) {
  const {id,image,marque,prix,type,couleur,taille,genre,etat} = req.query;
  req.session.idClothes = id;
  res.render('pages/modifArticle', {username: req.session.username,
    credits: "Crédits: " + req.session.credits, id:id, image:image, marque:marque, prix:prix, type: type, couleur:couleur, taille:taille, genre:genre, etat:etat})
})

https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'pf16'
}, app).listen(PORT, () => {
  console.log(`Site lancé sur le port ${PORT}!`)
});


