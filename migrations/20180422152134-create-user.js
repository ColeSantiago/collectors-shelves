'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING        
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING        
      },
      username: {
        allowNull: false,
        validate: {
          len: {
              args: [3, 20],
                msg: "Username must be between 3 and 20 characters in length"
          }
        },
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        validate: {
          len: {
              args: [6, 128],
                msg: "Email address must be between 6 and 128 characters in length"
          },
          isEmail: {
            msg: "Email address must be valid"
          }
        },
        type: Sequelize.STRING
      },
      bio: {
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING, 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};