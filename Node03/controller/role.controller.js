const { User, Role, Permission } = require("../models/index");
const { string } = require("yup");
const { Op, where } = require("sequelize");
const bcrypt = require("bcrypt");
const { name } = require("ejs");
const { isPermission } = require("../utils/permission");
module.exports = {
  index: async (req, res, next) => {
    const roles = await Role.findAll({
      order: [["id", "desc"]],
    });
    res.render("role/index", { roles });
  },
  create: (req, res) => {
    res.render("role/add");
  },
  handleCreate: async (req, res) => {
    const body = req.body;
    const roleName = body.name;
    // lấy ra mảng chứa tất cả các role được chọn
    const arrayRole = Object.keys(body).slice(1);
    const role = await Role.create({
      name: roleName,
    });

    const listArr = arrayRole.map(async (item) => {
      const permission = await Permission.findOrCreate({
        where: { value: item.trim() },
        defaults: { item },
      });

      return await role.setPermissions(permission[0]);
    });

    Promise.all(listArr)
      .then((result) => {
        console.log(result);
      })
      .catch((e) => {
        console.log(e);
      });

    res.redirect("/role");
  },
  edit: async (req, res, next) => {
    const { id } = req.params;
    try {
      const role = await Role.findOne({
        where: { id },
        include: {
          model: Permission,
          as: "permissions",
        },
      });
      if (!role) {
        throw new Error("Không tìm thấy role");
      }
      // set value vào bảng trung gian role_permission
      const dataPermissions = await role.getPermissions();
      const listPermissions = Object.entries(dataPermissions).map((item) => {
        return item[1].value;
      });
      res.render("role/edit", {
        role,
        listPermissions,
        isPermission,
      });
      // res.json({ listPermissions });
    } catch (e) {
      return next(e);
    }
  },
  handleEdit: async (req, res) => {
    const { id } = req.params;
    const { name, permissions } = req.body;
    // lấy ra mảng chứa tất cả các permission được chọn
    await Role.update(
      {
        name,
      },
      {
        where: { id },
      }
    );
    const role = await Role.findByPk(id);
    if (role) {
      const permissionInstances = await Promise.all(
        permissions.map(async (value) => {
          const [permissionInstance] = await Permission.findOrCreate({
            where: { value: value.trim() },
            defaults: { value: value.trim() },
          });
          return permissionInstance;
        })
      );
      await role.setPermissions(permissionInstances);
    }
    // res.json({ name, permissions });
    return res.redirect("/role/edit/" + id);
  },

  permission: async (req, res) => {
    const { id } = req.params;
    const roles = await Role.findAll({
      order: [["id", "desc"]],
    });
    const user = await User.findByPk(id, {
      include: {
        module: Role,
        as: "roles",
      },
    });
    res.render("role/permission", { roles, user });
  },

  handleSetRoleForUser: async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const user = await User.findByPk(id, {
      include: {
        module: Role,
        as: "roles",
      },
    });
    const arrayRole = Object.keys(body);
    const listRole = arrayRole.map(async (item) => {
      const role = await Role.findAll({
        where: { name: item },
        defaults: { item },
      });

      return await user.setRoles(role[0]);
    });

    Promise.all(listRole)
      .then((result) => {
        console.log(result);
      })
      .catch((e) => {
        console.log(e);
      });

    res.redirect("/users");
  },

  delete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const role = await Role.findOne({
        where: { id },
        include: [
          {
            model: Permission,
            as: "permissions",
          },
          {
            model: User,
            as: "users",
          },
        ],
      });
      await role.removePermissions(role.permissions);
      await role.removeUsers(role.users);
      await role.destroy();
      res.redirect("/role");
    } catch (e) {
      return next(e);
    }
  },
};
