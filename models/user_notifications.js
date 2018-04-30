'use strict';
module.exports = (sequelize, DataTypes) => {
  var user_notifications = sequelize.define('user_notifications', {
    userId: DataTypes.INTEGER,
    friendId: DataTypes.INTEGER,
    friendUsername: DataTypes.STRING,
    message: DataTypes.STRING,
  }, {});
  user_notifications.associate = function(models) {
    // associations can be defined here
    user_notifications.belongsTo(models.user, {foreignKey : 'userId'});
  };
  return user_notifications;
};