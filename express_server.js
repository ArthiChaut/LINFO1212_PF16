const express = require("express");
var session = require('express-session');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var https = require('https');
var fs = require('fs');

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



//get request to the root path  
app.get("/", (req, res) => {
  res.render("pages/main")
});

app.get('/login',async function(req,res) {
  res.render('pages/login')
});

app.get('/register',async function(req,res) {
  res.render('pages/register')
});

app.get('/panier',async function(req,res) {
  res.render('pages/panier')
});

app.get('/profil', async function(req,res) {
  res.render('pages/profil')
});

app.get('/vente', async function(req,res) {
  res.render('pages/sellClothes')
});

app.get('/info', async function(req,res) {
  res.render('pages/clothesInfos')
});



https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'pf16'
}, app).listen(PORT, () => {
  console.log(`Site lancé sur le port ${PORT}!`)
});