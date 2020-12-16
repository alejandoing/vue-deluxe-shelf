const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Book = mongoose.model(
  "Book",
  new Schema({
    ISBN13: String,
    title: String,
    pages: Number,
    format: String,
    status: String,
    works: [{ type: Schema.Types.ObjectId, ref: 'Work' }],
    DScollection: { type: Schema.Types.ObjectId, ref: 'Collection' },
    store: Boolean
  })
);

module.exports = Book;