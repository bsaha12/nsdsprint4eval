const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema(
  {
    token: String,
  },
  {
    versionKey: false,
  }
);

const BlackListModel = mongoose.model("blacklist", tokenSchema);

module.exports = { BlackListModel };
