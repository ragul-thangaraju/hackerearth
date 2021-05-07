"use strict";

module.exports = {
  schema: {
    password: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    profile_type_name: {
      type: String,
    },
  },
};
