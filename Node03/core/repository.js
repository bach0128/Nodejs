module.exports = class {
  constructor() {}
  update(data, condition = {}) {
    return this.model.update(data, {
      where: condition,
    });
  }
  create(data) {}
  updateByPk(data, id) {}
  delete(condition = {}) {}
  deleteByPk(id) {}
  findAll(options = {}) {}
  findByPk(id, options = {}) {}
};
