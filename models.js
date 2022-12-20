const {Model, DataTypes } = require('sequelize');
const sequelize = require('./database')


class User extends Model {}

User.init({


    credits:{
        type:DataTypes.INTEGER,
        primaryKey:false,
        allowNull:true
       },

    localisation: {
    type:DataTypes.TEXT,
    allowNull:false
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
        primaryKey:false,
        allowNull: false,
    },
    type: {
        type: DataTypes.TEXT,
        primaryKey: false,
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

    couleur: {
        type: DataTypes.TEXT,
        primaryKey: false,
        allowNull: false,
    },

    taille: {
        type: DataTypes.TEXT,
        primaryKey: false,
        allowNull: false,
    },

    genre: {
        type: DataTypes.TEXT,
        primaryKey: false,
        allowNull: false,
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

    sold:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        primaryKey:false

    }
  
  },

  { sequelize });






module.exports = {User,Clothes};