"use strict";
const controller = require("./controller");
const joi = require("joi");
const Util = require("../util/util");

module.exports = [
  {
    method: "GET",
    path: "/check",
    handler: () => {
      return "Hello From server";
    },
    options: {},
  },
  {
    method: "POST",
    path: "/register",
    handler: controller.userRegister,
    options: {
      validate: {
        payload: joi.object({
          email: joi.string().required().error(new Error("email required")),
        }),
      },
    },
  },
  {
    method: "POST",
    path: "/adminLogin",
    handler: controller.adminLogin,
    options: {
      validate: {
        payload: joi.object({
          username: joi
            .string()
            .required()
            .error(new Error("username required")),
          password: joi
            .string()
            .required()
            .error(new Error("password required")),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/getUsers",
    handler: controller.getUsers,
    options: {
      auth: "auth",
    },
  },
  {
    method: "POST",
    path: "/sentMail",
    handler: controller.sentMail,
    options: {
      validate: {
        payload: joi.object({
          description: joi
            .string()
            .required()
            .error(new Error("description required")),
          subject: joi.string().required().error(new Error("subject required")),
        }),
        failAction: (request, h, error) => {
          return Util.response(h, 1, error.output.payload.message, 400);
        },
      },
    },
  },
];
