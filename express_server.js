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
  

app.listen(PORT, () => {
  console.log(`Site lancé sur le port ${PORT}!`)
});
