const { User } = require("./models");


async function countExist(username){
    
    //return true;
    let name1 = await User.findOne({where: {username: username}});
    let name2 = await User.findOne({where: {email: username}});
    //console.log(name1 === null, name2 === null);
    if(name1 === null && name2 === null){
        return false;
    } else {
        return true;
    }  

    
}

module.exports = {
    countExist,
};