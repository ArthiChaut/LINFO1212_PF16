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
        reference:{
            model:User,
            key:"username"
        }
    
    }
  
  },

  { sequelize });


class soldClothes extends Model {}

soldClothes.init({

    clothes:{
        type: DataTypes.TEXT
        
    }











})

module.exports = {User,Incident};