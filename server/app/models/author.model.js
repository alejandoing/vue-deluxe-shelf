const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Author = mongoose.model(
  "Author",
  new Schema({
    name: String,
    country: String,
    genre: String,
    birth: String,
    death: String
  })
);

module.exports = Author;