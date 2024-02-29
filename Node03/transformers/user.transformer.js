const Transformer = require("../core/transformer");

module.exports = class extends Transformer {
  // đinh nghĩa dữ liện trả về api
  response(instance) {
    return {
      UID: instance.id,
      name: instance.fullname,
      status: instance.status ? "Kích hoạt" : "Chưa kích hoạt",
      createdAt: instance.created_at,
      updatedAt: instance.updated_at,
    };
  }
};
