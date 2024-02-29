const UserRepository = require("../repositories/user.repository");
const userRepository = new UserRepository();
module.exports = {
  create: (data) => {
    // goi model
    userRepository.create(data);
  },
  login: (email, password) => {},
};
