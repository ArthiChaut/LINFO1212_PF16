const { User, Clothes } = require("./models");
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");



async function countExist(username){
    
    let name1 = await User.findOne({where: {username: username}});
    let name2 = await User.findOne({where: {email: username}});
    if(name1 === null && name2 === null){
        return false;
    } else {
        return true;
    }  
}

async function passwordCorrect(username, password){
    let name1 = await User.findOne({where: {username: username}});
    let name2 = await User.findOne({where: {email: username}});
    let res1 = splitSearchPassword(name1, password);
    let res2 = splitSearchPassword(name2, password);
    if(res1){
        return name1;
    } else if(res2){
        return name2;
    }else {
        return false;
    }

}

function splitSearchPassword(name, password){
    if(name === null){
        return null;
    } else {
        if(bcrypt.compareSync(password, name.password)){
            return true;
        } else {
            return false;
        }
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------

async function countExistForCreate(username, email){

    let name1 = await User.findOne({where: {username: username}});
    let name2 = await User.findOne({where: {email: email}});
    if(name1 != null){
        console.log("Nom d'utilisateur déjà pris");
        return true;
    } else if(name2 != null){
        console.log("Email déjà utilisé");
        return true;
    } else {
        return false;
    }
    
    /*
    let resultat = false;
    countExist(username).then(resultuser => {
        if(resultuser){
          console.log("Nom d'utilisateur déjà pris");
          resultat = true;
        } else {
            countExist(email).then(resultmail => {
                if(resultmail){
                  console.log("Adresse mail déjà utilisée");
                  resultat = true;
                }
            })
        }
    })
    return resultat;
    */
    
}

function checkEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

function validate(email){
    var emailtocheck = email;
    if(checkEmail(emailtocheck)) {
        console.log("Adresse e-mail valide");
        return true;
    } else {
        console.log("Adresse e-mail invalide");
        return false;
    }

}

function passwordConfirm(password1, password2){
    if(password1 === password2){
        return true;
    } else {
        return false;
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------

async function fiveLastInstances(table){
    let array = await table.findAll({
        order: [["createdAt","DESC"]],
        limit:5,
        where:{sold:false}
    })
    return array;
}

async function clothesByMe(table, username){

    let array = await table.findAll({
        order: [["createdAt","DESC"]],
        where:{user:username}
    })
    return array;
}

async function rechercherProduits(sizeFilter, colorFilter, genreFilter, typeFilter, etatFilter) {
    //Permet de rechercher des produits en fonctions de plusieurs critères
    //Si le critère n'est pas renseigné, il n'est pas pris en compte dans la recherche
    const where = {};
    if (sizeFilter) {
        where.taille = {
        [Op.eq]: sizeFilter
        };
    }
    if (colorFilter) {
        where.couleur = {
        [Op.eq]: colorFilter
        };
    }
    if (genreFilter) { 
        where.genre = {
        [Op.eq]: genreFilter
        };
    }
    if (typeFilter) {
        where.type = {
        [Op.eq]: typeFilter
        };
    }
    if (etatFilter) {
        where.etat = {
        [Op.eq]: etatFilter
        };
    }

    // Exécutez la recherche en utilisant la clause "where"
    const products = await Clothes.findAll({ where });

    return products;
}

//Affiche tout les vêtements de la base de données
async function displayClothes(filtre){
    let array = await Clothes.findAll({
        where: { genre: filtre }
    })
    return array;
}


async function getUserLocation(username){

    let location = await User.findOne({
        where:{username: username}
    })
    return location.localisation;
}

async function getLatestSells(){

    let result = await Clothes.findAll({
        where:{sold: true},
        limit:5,
        order:[['createdAt','DESC']]
    })
    return result;
}

async function changeCredit(credit, username){
    let name = await User.findOne({where: {username: username}});
    name.set({
        credits: name.credits + parseInt(credit)
    });
    await name.save();
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
    countExist, 
    passwordCorrect, 
    countExistForCreate, 
    validate, 
    passwordConfirm, 
    fiveLastInstances, 
    clothesByMe,
    getUserLocation,
    getLatestSells,
    displayClothes,
    rechercherProduits,
    changeCredit
}