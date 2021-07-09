const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define('turisms', {
    name: {
      type: DataTypes.STRING
    },
    difficult: {
      type: DataTypes.SMALLINT
    },
    duration: { 
      type: DataTypes.STRING
    },
    season: {
      type: DataTypes.STRING
    }
  }) 
}