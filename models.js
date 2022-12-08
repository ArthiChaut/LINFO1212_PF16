const {Model, DataTypes } = require('sequelize');
const sequelize = require('./database')


class User extends Model {}

User.init({
    
  completeName: {
    type: DataTypes.TEXT,
    primaryKey: false
    },
  
   username: {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull:false
    },

    email: {
        type:DataTypes.TEXT,
        primaryKey:true,
        allowNull:false
    },

    password: {
        type:DataTypes.TEXT,
        allowNull:false
    }
    },{ sequelize }
    
)

class Clothes extends Model {}

Clothes.init({
    image: {
        type:DataTypes.TEXT,
        primaryKey:true,
        allowNull: false,
    },

    marque: {
        type: DataTypes.TEXT,
        primaryKey: false,
        allowNull: true,
      },

    prix: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        allowNull: false,
      },

    matiere: {
        type: DataTypes.TEXT,
        primaryKey: false,
        allowNull: true,
      },

    couleur: {
        type: DataTypes.TEXT,
        primaryKey: false,
        allowNull: true,
    },
    
    description: {
        type: DataTypes.TEXT,
        primaryKey: false,
        allowNull: true,
    },

    localisation: {
        type: DataTypes.TEXT,
        primaryKey: false,
        allowNull: true,
    },
  

    user:{
        type : DataTypes.TEXT,
        allowNull : false,
        references:{
            model:User,
            key:"username"
        }
    
    }
  
  },

  { sequelize });


class soldClothes extends Model {}

soldClothes.init({

    id:{
        type:DataTypes.INTEGER,
        references:{
            model:Clothes,
            key:"id"
        }
    },
    marque: {
        type: DataTypes.TEXT,
        references:{
            model:Clothes,
            key:"marque"
        }
      },

    prix: {
        type: DataTypes.INTEGER,
        references:{
            model:Clothes,
            key:"prix"
        }
      },



    matiere: {
        type: DataTypes.TEXT,
        references:{
            model:Clothes,
            key:"matiere"
        }
      },

    couleur: {
        type: DataTypes.TEXT,
        references:{
            model:Clothes,
            key:"couleur"
        }
    },

    description: {
        type: DataTypes.TEXT,
        references:{
            model:Clothes,
            key:"description"
        }
    },

    localisation: {
        type: DataTypes.TEXT,
        references:{
            model:Clothes,
            key:"localisation"
        }
    },
  

    user:{
        type : DataTypes.TEXT,
        allowNull : false,
        references:{
            model:User,
            key:"username"
        }
    
    }











})

module.exports = {User,Clothes,soldClothes};