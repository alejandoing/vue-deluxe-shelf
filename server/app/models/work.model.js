const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Work = mongoose.model(
  "Work",
  new Schema({
    title: String,
    authors: [{ type: Schema.Types.ObjectId, ref: 'Author' }],
    year: String,
    language: String,
    categories: [{ type: Schema.Types.ObjectId, ref: 'Categorie' }]
  })
);

module.exports = Work;