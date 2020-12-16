const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Categorie = mongoose.model(
  "Categorie",
  new Schema({
    title: String
  })
);

module.exports = Categorie;