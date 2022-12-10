const express = require("express");
var session = require('express-session');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var https = require('https');
var fs = require('fs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: "propre123",
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
}, app).listen(8080);
