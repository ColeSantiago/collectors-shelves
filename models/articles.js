'use strict';
module.exports = (sequelize, DataTypes) => {
  var articles = sequelize.define('articles', {
    title: DataTypes.STRING,
    link: DataTypes.STRING
  }, {});
  articles.associate = function(models) {
    // associations can be defined here
  };
  return articles;
};