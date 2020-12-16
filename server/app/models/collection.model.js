const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Collection = mongoose.model(
  "Collection",
  new Schema({
    title: String,
    language: String,
    description: String,
    publisher: { type: Schema.Types.ObjectId, ref: 'Publisher' }
  })
);

module.exports = Collection;