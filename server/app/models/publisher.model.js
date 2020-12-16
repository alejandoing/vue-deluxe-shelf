const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Publisher = mongoose.model(
  "Publisher",
  new Schema({
    title: String,
    country: String
  })
);

module.exports = Publisher;