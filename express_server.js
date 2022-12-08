const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
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

 


app.listen(PORT, () => {
  console.log(`Site lancé sur le port ${PORT}!`)
});
