const { User } = require("./models");
const bcrypt = require('bcryptjs');



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

module.exports = {
    countExist, passwordCorrect,
};
