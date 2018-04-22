'use strict';
module.exports = (sequelize, DataTypes) => {
  var user_friends = sequelize.define('user_friends', {
    userId: DataTypes.INTEGER,
    friendId: DataTypes.INTEGER
  }, {});
  user_friends.associate = function(models) {
    // associations can be defined here
    user_friends.belongsTo(models.user, {foreignKey : 'userId'});
  };
  return user_friends;
};