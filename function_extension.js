const { User, Clothes } = require("./models");
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");




async function accountExist(username){

/*
pre condition: username is a string
post condition: return true if the username is already taken, false otherwise
*/

    let name1 = await User.findOne({where: {username: username}});
    let name2 = await User.findOne({where: {email: username}});
    if(name1 === null && name2 === null){
        return false;
    } else {
        return true;
    }  
}

async function passwordCorrect(username, password){

    /*
        pre condition: username and password are strings
        post condition: return true if the password is correct, false otherwise
    */

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

async function accountExistForCreate(username, email){

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


function checkPrice(prix){

    /*
        pre condition: prix is a string
        post condition: return true if the string is a number, false otherwise
    */

    let isnum = /^\d+$/.test(prix);
    return isnum;
}

function checkEmail(email){

    /*
        pre condition: email is a string
        post condition: return true if the string is in an email format, false otherwise
    */

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  /*
function validate(email){
    var emailtocheck = email;
    if(checkEmail(emailtocheck)) {
        return true;
    } else {
        return false;
    }

}
*/

function passwordConfirm(password1, password2){

    /*
        pre condition: password1 and password2 are strings
        post condition: return true if the two strings are the same, false otherwise
    */

    if(password1 === password2){
        return true;
    } else {
        return false;
    }
}

function setupSession(array,session){
    session.image = array.image;
    session.username = array.username;
    session.completeName = array.completeName;
    session.email = array.email;
    session.credits = array.credits;
    session.localisation = array.localisation;
    session.panier = [];
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------

async function fiveLastInstances(table){

    /*
        pre condition: table is a table
        post condition: return an array of the 5 last products of the table
    */

    let array = await table.findAll({
        order: [["createdAt","DESC"]],
        limit:5,
        where:{sold:false}
    })
    return array;
}

async function clothesByMe(table, username){

    /*
        pre condition: table is a table, username is a string
        post condition: return an array of products that match the username
    */

    let array = await table.findAll({
        order: [["createdAt","DESC"]],
        where:{user:username,
                sold:false
            }
    })
    return array;
}

async function rechercherProduits(sizeFilter, colorFilter, genreFilter, typeFilter, etatFilter) {
    
    /*
        pre condition: sizeFilter, colorFilter, genreFilter, typeFilter, etatFilter are strings
        post condition: return an array of products that match the filters
    */
    //Permet de rechercher des produits en fonctions de plusieurs critères
    //Si le critère n'est pas renseigné, il n'est pas pris en compte dans la recherche


    const where = {sold : 0};
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

    const products = await Clothes.findAll({order: [["createdAt","DESC"]], where });
    console.log(products)
    return products;
}

async function displayClothes(filtre){

    /*
        pre condition: filtre is a string
        post condition: return an array of products that match the filter
    */

    let array = await Clothes.findAll({
        order: [["createdAt","DESC"]],
        where: { genre: filtre, sold: 0 }
    })
    return array;
}


async function getUserLocation(username){

    /*
        pre condition: username is a string
        post condition: return the location of the user
    */

    let location = await User.findOne({
        where:{username: username}
    })
    return location.localisation;
}

async function getLatestSells(username){

    /*
        pre condition: username is a string
        post condition: return an array of the 5 last products sold by the user
    */

    if(username){
        let result = await Clothes.findAll({
            where:{
                sold: true,
                user: username
            },
            limit:5,
            order:[['updatedAt','DESC']]
        })
        return result;        
    }
    return [];
}

async function changeCredit(credit, username){

    /*
        pre condition: credit is a string, username is a string
        post condition: add the credit to the user
    */

    let name = await User.findOne({where: {username: username}});
    name.set({
        credits: name.credits + parseInt(credit)
    });
    await name.save();
}

async function changePP(newPP, username){
    
    /*
        pre condition: newPP is a string of a image PATH, username is a string 
        post condition: change the profile picture of the user
    */

    let name = await User.findOne({where: {username: username}});
    name.set({
        image: "static/IMAGES/" + newPP
    });
    await name.save();
    return name.image;
    
}

async function changeVetement(listModif, id){

    let name = await Clothes.findOne({where: {id: id}});
    let listActuel = [name.image, name.type, name.marque, name.prix, name.couleur, name.taille, name.genre, name.etat];
    for(let i = 0; i < listModif.length; i++){
        if(listModif[i] != "" && listModif[i] != "No change" && listModif[i] != 'static/IMAGES/undefined'){
            listActuel[i] = listModif[i];
        }
    }
    
    name.set({
        image: listActuel[0],
        type: listActuel[1],
        marque: listActuel[2],
        prix: listActuel[3],
        couleur: listActuel[4],
        taille: listActuel[5],
        genre: listActuel[6],
        etat: listActuel[7]
    });
    await name.save();
}

function getPanierTotal(array){

    /*
        pre condition: array is an array of objects
        post condition: return the sum of the prices of the objects in the array
    */

    let sum = 0;
    for(let i = 0 ; i < array.length; i++){
        sum += array[i].Prix;
    }
    return sum;
}


async function removeArticles(array){
    
    /*
        pre condition:
        post condition:
    */
    
    for(let i = 0 ; i < array.length;i++){
        let name = await Clothes.findOne({where: {image: array[i].Image}});
    name.set({
        sold:true
    });
    await name.save();

    }
    
}

function updateAllCredits(array){
    for(let i = 0 ; i < array.length;i++){
        changeCredit(array[i].Prix,array[i].User)

        }
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
    accountExist, 
    passwordCorrect, 
    accountExistForCreate, 
    checkPrice, 
    passwordConfirm, 
    fiveLastInstances, 
    clothesByMe,
    getUserLocation,
    getLatestSells,
    displayClothes,
    rechercherProduits,
    changeCredit,
    getPanierTotal,
    changeVetement,
    removeArticles,
    updateAllCredits,
    setupSession,
    changePP,
    splitSearchPassword,
    checkEmail
}