'use strict';
module.exports = (sequelize, DataTypes) => {
  var collection_photos = sequelize.define('collection_photos', {
    collectionId: DataTypes.INTEGER,
    photo_link: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    title: DataTypes.STRING
  }, {});
  collection_photos.associate = function(models) {
    // associations can be defined here
    collection_photos.belongsTo(models.user, {foreignKey : 'collectionId'});
  };
  return collection_photos;
};