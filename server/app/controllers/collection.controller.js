const db = require("../models");
const mongoose = require("mongoose");

const Collection = db.collection;
const Book = db.book;
const Work = db.work;

exports.add = async (req, res) => {
  const { description, language, publisher, title } = req.body.collection;
  const collectionFormatted = { description, language, title, publisher: mongoose.Types.ObjectId(publisher) };

  try {
    const collection = await Collection.create(collectionFormatted);
    res.status(200).send(collection);
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
};

exports.findAll = async (req, res) => {
  const collectionData = await Collection.find({}).populate('publisher');
  
  res.status(200).send(collectionData);
};

exports.findOne = async (req, res) => {
  const collectionData = await Collection.findById(req.params.id).populate('publisher');
  const books = await Book.find({ DScollection: req.params.id, $where: "this.works.length > 0" } )
    .populate({
      path: 'works',
      populate: {
        path: 'authors',
        model: 'Author'
      }
    });
  
  res.status(200).send({ ...collectionData._doc , books});
};

// exports.create = async (req, res) => {
//   const ids = ['5f9eecb578fa5a20e48fa775','5f9eecb578fa5a20e48fa776','5f9eecb578fa5a20e48fa777','5f9eecb578fa5a20e48fa7c1','5f9eecb578fa5a20e48fa7c3',
// '5f9eecb578fa5a20e48fa7c2']

//   //const works = await Work.find({ _id: { $in: ids } });
//   const books = await Book.find({ $where: "this.works.length < 1" });

//   // const update = await Book.updateMany(
//   //   { $where: "this.works.length < 1" },
//   //   {
//   //     $set: { "works": [ mongoose.Types.ObjectId('5f9eeaf978fa5a20e48fa6d3') ] },
//   //   },
//   // );

//   //console.log(update);
  
//   res.status(200).send({ books });
// };