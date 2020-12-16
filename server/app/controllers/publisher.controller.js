const db = require("../models");

const Publisher = db.publisher;
const Collection = db.collection;

exports.add = async (req, res) => {
  try {
    const publisher = await Publisher.create(req.body.publisher);
    res.status(200).send(publisher);
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
};

exports.findAll = async (req, res) => {
  const publisherData = await Publisher.find({});

  for (let i in publisherData) {
    publisherData[i] = { 
      collections: await Collection.find({ publisher: publisherData[i]._id }),
      ...publisherData[i]._doc
    }
  }
  
  res.status(200).send(publisherData);
};