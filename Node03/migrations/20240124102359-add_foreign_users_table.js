"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("users", {
      name: "users_group_id_foreign",
      type: "foreign key",
      fields: ["group_id"],
      references: {
        table: "groups",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("users", "users_group_id_foreign");
  },
};
