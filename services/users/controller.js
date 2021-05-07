const modal = require("./modal");
const Util = require("../util/util");

const userRegister = async (request, h) => {
  const params = request.payload;
  const created = await modal.userRegister(params);

  if (created instanceof Error) {
    return Util.response(h, 2, created.message, 200);
  }
  return Util.response(h, 0, created, 200);
};

const adminLogin = async (request, h) => {
  const params = request.payload;
  const created = await modal.adminLogin(params);

  if (created instanceof Error) {
    return Util.response(h, 2, created.message, 200);
  }
  return Util.response(h, 0, created, 200);
};

const getUsers = async (request, h) => {
  const created = await modal.getUsers();

  if (created instanceof Error) {
    return Util.response(h, 2, created.message, 200);
  }
  return Util.response(h, 0, created, 200);
};

const sentMail = async (request, h) => {
  const params = request.payload;
  const created = await modal.sentMail(params);

  if (created instanceof Error) {
    return Util.response(h, 2, created.message, 200);
  }
  return Util.response(h, 0, created, 200);
};

module.exports = {
  userRegister: userRegister,
  adminLogin: adminLogin,
  getUsers: getUsers,
  sentMail: sentMail,
};
