const {Model, DataTypes } = require('sequelize');
const sequelize = require('./database')


class User extends Model {}

User.init({


    credits:{
        type:DataTypes.INTEGER,
        primaryKey:false,
        allowNull:true
       },     

   image:{
    type:DataTypes.TEXT,
    primaryKey:false,
    allowNull:true
   }, 

  completeName: {
    type: DataTypes.TEXT,
    primaryKey: false
    },
  

   username: {
        type: DataTypes.TEXT,
        primaryKey: true,   
    },

    email: {
        type:DataTypes.TEXT,
        primaryKey:false,
        allowNull:false
    },
    

    password: {
        type:DataTypes.TEXT,
        allowNull:false
    },
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
    
    etat: {
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
    
    },

    localisation: {
        type:DataTypes.TEXT,
        allowNull:false
    },

    sold:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        primaryKey:false

    }
  
  },

  { sequelize });






module.exports = {User,Clothes};