'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    photo: DataTypes.STRING, 
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.hasMany(models.user_friends);
    user.hasMany(models.user_likes);
    user.hasMany(models.user_collection);
    user.hasMany(models.user_notifications);
  };
  return user;
};