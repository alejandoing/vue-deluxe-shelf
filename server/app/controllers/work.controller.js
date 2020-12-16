const db = require("../models");
const { mongoose } = require("../models");
const Work = db.work;

exports.add = async (req, res) => {
  const { authors, title, year, language } = req.body.work;
  const workFormatted = { title, year, language, authors: authors.map(x => mongoose.Types.ObjectId(x)) };

  try {
    const work = await Work.create(workFormatted);
    res.status(200).send(work);
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
};

exports.findAll = async (req, res) => {
  const workData = await Work.find({}).populate('authors');
  
  res.status(200).send(workData);
};

exports.update = async (req, res) => {
  console.log(req.body);

  const { _id, authorsSelect, title, year, language } = req.body.work;
  const newValues = {
    $set: {
      title, year, language, authors: authorsSelect.map(x => mongoose.Types.ObjectId(x))
    }
  }

  try {
    const updated = await Work.findByIdAndUpdate({ _id }, newValues, { useFindAndModify: false });
    
    console.log(updated);
    res.status(200).send(updated);
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
};