'use strict';
module.exports = (sequelize, DataTypes) => {
  var user_collection = sequelize.define('user_collection', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  user_collection.associate = function(models) {
    // associations can be defined here
    user_collection.hasMany(models.collection_photos);
    user_collection.hasMany(models.collection_keywords);
    user_collection.belongsTo(models.user, {foreignKey : 'userId'});
  };
  return user_collection;
};