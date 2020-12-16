const db = require("../models");
const Author = db.author;

exports.add = async (req, res) => {
  try {
    const author = await Author.create(req.body.author);
    res.status(200).send(author);
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
};

exports.findAll = async (req, res) => {
  const authorData = await Author.find({}).populate('authors');
  
  res.status(200).send(authorData);
};