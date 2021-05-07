const Entity = require("../../entity/index").Models;
const { config } = require("../../config/config");
const Jwt = require("jwt-simple");
var ObjectId = require("mongodb").ObjectId;
const mailjet = require("node-mailjet").connect(
  "28ff0dee9bc8c03ad9fe8d2e69b269d9",
  "398a377e3fdc822f39a562d853e75812"
);
const registrationTemplate = require("../template/registration");
const commonMail = require("../template/commonMail");
/**
 * Method to check email exist or not
 * @param {string} params
 */
const isEmailAlreadyPresent = async (params) => {
  return Entity.Users.findOne({
    email: params.email,
    profile_type_name: "USER",
  })
    .then((response) => {
      if (!response) {
        return false;
      }
      return true;
    })
    .catch((err) => {
      return new Error(err);
    });
};

/**
 * Method to register a new user
 * @param {string} params
 */
const userRegister = async (params) => {
  let emailAlreadyPresent = await isEmailAlreadyPresent(params);
  if (emailAlreadyPresent) {
    return new Error("email already used");
  }
  const insertData = {
    email: params.email,
    profile_type_name: "USER"
  };
  return Entity.Users.create(insertData)
    .then(async (resp) => {
      const request = mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "ragulthangaraju@gmail.com",
              Name: "ragul",
            },
            To: [
              {
                Email: params.email,
                Name: params.email,
              },
            ],
            Subject: "Welcome! Greetings from Admin.",
            TextPart: "Welcome!",
            HTMLPart: registrationTemplate(params.email),
          },
        ],
      });
      return await request
        .then((result) => {
          return true;
        })
        .catch((err) => {
          return false;
        });
    })
    .catch((err) => {
      return new Error(err);
    });
};

/**
 * Method to login user
 * @param {string} params
 */
const adminLogin = async (params) => {
  return Entity.Users.findOne({
    username: params.username,
    profile_type_name: "ADMIN",
  })
    .then(async (resp) => {
      if (!resp) {
        return new Error("No username found");
      }
      if (
        Jwt.decode(resp.password, config.secret).toString() ===
        params.password.toString()
      ) {
        const token = Jwt.encode(resp._id, config.secret);

        return (data = {
          userData: {
            _id: resp._id,
            username: resp.username,
            type: resp.profile_type_name,
          },
          token,
        });
      } else {
        return new Error("Wrong password");
      }
    })
    .catch((err) => {
      return new Error(err);
    });
};

/**
 * Method to get all users
 */
const getUsers = async () => {
  return Entity.Users.find({ profile_type_name: "USER" })
    .then(async (resp) => {
      if (!resp) {
        return "No user found";
      }
      return resp;
    })
    .catch((err) => {
      return new Error(err);
    });
};

/**
 * Method to add new post
 * @param {string} params
 */
const sentMail = async (params) => {
  return Entity.Users.aggregate([
    {
      $match: {
        profile_type_name: "USER",
      },
    },
    {
      $project: {
        email: 1,
        _id: 0,
      },
    },
  ])
    .then(async (resp) => {
      if (!resp) {
        return false;
      }
      const request = mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "ragulthangaraju@gmail.com",
              Name: "Hi there",
            },
            To: resp,
            Subject: params.subject,
            TextPart: params.description,
            HTMLPart: commonMail(params.description),
          },
        ],
      });
      return await request
        .then((result) => {
          return true;
        })
        .catch((err) => {
          return false;
        });
    })
    .catch((err) => {
      return false;
    });
};

/**
 * Method to validate a user
 */
const getValidUser = async (token) => {
  return Entity.Users.findOne({
    _id: ObjectId(Jwt.decode(token, config.secret)),
  })
    .then(async (resp) => {
      if (!resp) {
        return false;
      }
      return resp;
    })
    .catch((err) => {
      return new Error(err);
    });
};

module.exports = {
  userRegister: userRegister,
  adminLogin: adminLogin,
  getUsers: getUsers,
  sentMail: sentMail,
  getValidUser: getValidUser,
};
