"use strict";

/** @type {import('sequelize-cli').Migration} */
const bscrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = bscrypt.genSaltSync(10);
    const users = [
      {
        fullname: "Xuan Bach",
        email: "tranxuanbach98@gmail.com",
        password: bscrypt.hashSync("123456", salt),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    // for (let i = 0; i < 50; i++) {
    //   users.push({
    //     fullname: faker.person.fullName(),
    //     email: faker.internet.email(),
    //     status: faker.datatype.boolean(),
    //     created_at: faker.date.past(),
    //     updated_at: faker.date.past(),
    //     address: faker.location.streetAddress(),
    //   });
    // }
    await queryInterface.bulkInsert("users", users);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users");
  },
};
