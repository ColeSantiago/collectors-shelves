'use strict';
module.exports = (sequelize, DataTypes) => {
  var collection_keywords = sequelize.define('collection_keywords', {
    collectionId: DataTypes.INTEGER,
    keyword: DataTypes.STRING
  }, {});
  collection_keywords.associate = function(models) {
    // associations can be defined here
    collection_keywords.belongsTo(models.user_collection, {foreignKey : 'collectionId'});
  };
  return collection_keywords;
};