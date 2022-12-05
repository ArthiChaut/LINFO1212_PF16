const express = require('express');
const sequelize = require('./database');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const app = express();
const port = 3000;
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use('/static',express.static('static'));

app.use(session({
  secret: "propre123",
  resave: false,
  saveUninitialized: true,
}));

app.post('/create',async function(req,res) {
  const {name, username,email, password, confirmedPassword} = req.body;
  let usernamee = await User.findOne({where: {username: username}});
  let emaill = await User.findOne({where: {email: email}});
  let adresseGood = false;
  

  function checkEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  function validate(){
    var emailtocheck = email;
    if(checkEmail(emailtocheck)) {
      console.log("Adresse e-mail valide");
      adresseGood = true;
    } else {
      console.log("Adresse e-mail invalide");
      
    }

  }

  validate();

  if(adresseGood != true){
    res.redirect('/create');
  } else if (password != confirmedPassword){
    res.redirect('/create');
  } else if (usernamee != null){
    console.log("le nom d'utilisateur est déjà pris");
    res.redirect('/create');
  } else if (emaill != null){
    console.log("l'e-mail est déjà assigné à un compte'");
    res.redirect('/create');
  }
  
  
  
  else {
    User.create({completeName: req.body.name,
      username:req.body.username,
      email:req.body.email,
      password:bcrypt.hashSync(req.body.password,10)}).then(()=>
    res.redirect('/login'));
  }
})


app.post('/incident',async function(req,res) {
 
      
  
});
    
          



app.post('/login',async function(req,res) {
  const {username, password} = req.body;
  
  let name1 = await User.findOne({where: {username: username}});
  let name2 = await User.findOne({where: {email: username}});
  if(name1 === null && name2 === null){
    console.log("Le compte n'existe pas encore");
  } else {
    if(name1 === null){
      if(bcrypt.compareSync(req.body.password, name2.password)){
        console.log("Mot de passe correct");
        req.session.username = name2.username;
        logornot = true;
        if(beforelog){
          res.redirect("/incident");
        } else {
          res.redirect("/");
        }
        
      } else {
        res.redirect("/login");
      }
    } else {
      if(bcrypt.compareSync(req.body.password, name1.password)){
        console.log("Mot de passe correct");
        req.session.username = name1.username;
        logornot = true;
        if(beforelog){
          res.redirect('/incident');
        } else {
          res.redirect('/');
        }
      } else {
        console.log("Mot de passe incorrect");
        res.redirect("/login");
      }
    }
  }
    
})


app.get('/', function(req,res,next) {   
                              
  })
  
    
    

app.get('/login', function(req,res,next) {
    res.render('IdPage.ejs',{username:req.session.username});
  });

app.get('/incident', function(req,res,next) {
  
    
  });

  app.get('/create', function(req,res,next) {
    res.render('NewAccount.ejs');
  });
  
  app.use(express.static('content'));
app.listen(port, () => {
  console.log(`Site lancé sur le port ${port}!`)
});
