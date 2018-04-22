'use strict';
module.exports = (sequelize, DataTypes) => {
  var user_likes = sequelize.define('user_likes', {
    userId: DataTypes.INTEGER,
    photoId: DataTypes.INTEGER
  }, {});
  user_likes.associate = function(models) {
    // associations can be defined here
    user_likes.belongsTo(models.user, {foreignKey : 'userId'});
  };
  return user_likes;
};