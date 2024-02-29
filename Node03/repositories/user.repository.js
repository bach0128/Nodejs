const Repository = require("../core/repository");
const { User } = require("../models/index");
module.exports = class extends Repository {
  // Xác định được làm việc với model nào
  getModel() {
    return User;
  }
};
