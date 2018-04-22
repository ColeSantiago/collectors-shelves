'use strict';
module.exports = (sequelize, DataTypes) => {
  var user_description = sequelize.define('user_description', {
    userId: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {});
  user_description.associate = function(models) {
    // associations can be defined here
    user_description.belongsTo(models.user, {foreignKey : 'userId'});
  };
  return user_description;
};