const mongoose = require('mongoose');
const db = {};

mongoose.Promise = global.Promise;
db.mongoose = mongoose;

db.author = require("./author.model");
db.book = require("./book.model");
db.categorie = require("./categorie.model");
db.collection = require("./collection.model");
db.publisher = require("./publisher.model");
db.work = require("./work.model");

module.exports = db;