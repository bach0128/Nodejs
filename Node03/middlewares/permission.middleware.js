const { User, Role, Permission } = require("../models/index");

module.exports = (value) => {
  return async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      include: {
        model: Role,
        as: "roles",
        include: {
          model: Permission,
          as: "permissions",
        },
      },
    });
    const permissions = [];
    if (user.roles.length) {
      user.roles.forEach((role) => {
        role.permissions.forEach((permission) => {
          !permissions.includes(permission.value) &&
            permissions.push(permission.value);
        });
      });
    }
    if (!permissions.includes(value)) {
      return next(new Error("Invalid permissions"));
    }
  };
};
