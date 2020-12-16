const fs = require('fs');
const axios = require('axios');
const convert = require('xml-js');
const fetch = require('node-fetch');
const scrapy = require('node-scrapy');
const csv = require('csv-parser');
const utf8 = require('to-utf-8')

const db = require('../models');
const { mongoose, book } = require("../models");
const { format } = require('path');
const Book = db.book;

const setPath = (route, ext = true) => `./app/uploads/books/${route}${ext ? '.png' : ''}`;
const setTNURL = (resource) => `${tiendaNube.endPoint}${tiendaNube.userID}${resource}`;

const tiendaNube = 	{
  "endPoint": "https://api.tiendanube.com/v1/",
  "accessToken": "bearer 40f4734a37beee17c9691c90f9d71c45a42cee33",
  "userID": 1111169,
  "authConfig": {
    "headers": {
      "Authentication": "bearer 40f4734a37beee17c9691c90f9d71c45a42cee33",
      "Content-Type": "application/json",
      "User-Agent": "ventas@deluxe-books.com",
      "Access-Control-Allow-Origin": "*"
    }
  }
}


exports.add = async (req, res) => {
  const bookFormatted = JSON.parse(req.body.book);

  try {
    const book = await Book.create(bookFormatted);
    
    const collectionPath = setPath(bookFormatted.DScollection, false);
    const coverPath = setPath(req.file.filename, false);
    const finalPath = setPath(`${bookFormatted.DScollection}/${book._id}`);

  
    if (!fs.existsSync(collectionPath)){
      fs.mkdirSync(collectionPath);
    }

    fs.rename(coverPath, finalPath, (err) => {
      if (err) console.log('ERROR: ' + err)
    });

    res.status(200).send(book);
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
};

exports.findAll = async (req, res) => {
  const bookData = await Book.find({}).populate('works').populate('DScollection');
  
  res.status(200).send(bookData);
};

exports.update = async (req, res) => {
  const bookFormatted = typeof(req.body.book) === 'string'
    ? JSON.parse(req.body.book)
    : req.body.book;

  const { _id, ISBN13, format, status, pages, worksSelect, collectionSelect } = bookFormatted;

  try {
    const oldBook = await Book.findById(_id);
    
    const newPath  = setPath(`${collectionSelect}/${_id}`);
    const oldPath  = setPath(`${oldBook.DScollection}/${_id}`);
    const tempPath = setPath(_id);
  
    const newValues = {
      $set: {
        ISBN13,
        format,
        status,
        pages,
        works: worksSelect.map(x => mongoose.Types.ObjectId(x)),
        DScollection: collectionSelect
      }
    }
  
    const updated = await Book.findByIdAndUpdate({ _id }, newValues, { useFindAndModify: false });
    res.status(200).send(updated);

    if (req.file) {
      const coverPath = setPath(req.file.filename, false);
      const collectionPath = setPath(collectionSelect, false);
  
      if (!fs.existsSync(collectionPath)){
        fs.mkdirSync(collectionPath);
      }
      
      fs.rename(coverPath, newPath, (err) => { if (err) console.log('ERROR: ' + err) });
    } else {
      fs.rename(oldPath, tempPath, (err) => {
        if (err) console.log('ERROR: ' + err)
        fs.rename(tempPath, newPath, (err) => { if (err) console.log('ERROR: ' + err) });
      });
    }

  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
};

exports.send = async (req, res) => {
  const books = (await Book.find({ DScollection: '5f9ed27f497dd8e2658a20fe', store: false })
    .populate({ 
      path: 'DScollection',
      populate: {
        path: 'publisher',
        model: 'Publisher'
      }
    })
    .populate('works'));

  const base64_encode = (file) => {
    const bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
  }

  const setFormatDB = (format) => format == 'Hardback' ? 'Tapa Dura' : 'Tapa Blanda';
  const setLanguagueDB = (language) => language == 'English' ? 'Inglés' : language == 'Spanish' ? 'Español' : language;
  const setDimensionsDB = (dimensions) => dimensions.split("x").map(x => ` ${x} x`).join().replace(',','').slice(1,-1);
  const setAuthorDB = () => { return isArray(GRData.authors.author) ? GRData.authors.author[0].name._text : GRData.authors.author.name._text };

  const toggleStore = async (x) => {
    const newValues = { $set: { store: true } };
    await Book.findByIdAndUpdate({ _id: x._id }, newValues, { useFindAndModify: false });
  }

  const description = (data) => `
  <style type=\"text/css\">
    .test {\r\n
      box-sizing: border-box;\r\n    
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\r\n
      letter-spacing: 0.48px;\r\n
      margin: 12px 0px;\r\n
      line-height: 25px;\r\n
      font-size: 17px;\r\n
      color: rgb(0, 0, 0);\r\n}\r\n\r\n
    .strongStyles {\r\n
      color: rgb(0, 0, 0);\r\n
      font-size: 17px;\r\n
      letter-spacing: 0.48px;\r\n}\r\n\r\n
    .detailsStyles {\r\n
      box-sizing: border-box;\r\n
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\r\n
      letter-spacing: inherit;\r\n}\r\n\r\n
    .details2Styles {\r\n
      box-sizing: border-box;\r\n
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\r\n
      letter-spacing: inherit;\r\n
      vertical-align: baseline;\r\n}\r\n
  </style>\r\n
    
  <p class=\"spec test\">
    <strong class=\"strongStyles\">ESPECIFICACIONES DEL PRODUCTO:</strong></p>\r\n\r\n
    <hr />\r\n
    <p class=\"spec test\">
      <span class=\"detailsStyles\">Autor: ${data.author}</span><br />\r\n
      <span class=\"detailsStyles\">Editorial: ${data.publisher}</span><br />\r\n
      <span class=\"detailsStyles\">Idioma: ${data.language}</span><br />\r\n
      <span class=\"detailsStyles\">Formato:&nbsp;<span class=\"details2Styles\">${data.format}</span></span><br />\r\n
      <span class=\"detailsStyles\">ISBN:&nbsp;</span>${data.ISBN13}<br />\r\n
      <span class=\"detailsStyles\">N&uacute;mero de P&aacute;ginas:&nbsp;<span class=\"details2Styles\">${data.pages}</span></span><br />\r\n
      <span class=\"detailsStyles\">Peso: ${data.weight}</span><br />\r\n
      <span class=\"detailsStyles\">Dimensiones:&nbsp;</span>${data.dimensions}
    </p>\r\n\r\n
    <p class=\"spec test\" style=\"margin-top: 40px !important;\">
      <strong class=\"strongStyles\">VISI&Oacute;N GENERAL:</strong>
    </p>\r\n\r\n
    <hr />\r\n
    <div class=\"test\" style=\"text-align: justify\">\r\n${data.description}</div>\r\n`

  for (let [i, x] of books.entries()) {
    const cover = base64_encode(setPath(`${x.DScollection._id}/${x._id}`));
    const urlProductSKU = setTNURL(`/products/sku/${x.ISBN13}`);

    console.log({ title: x.title, ISBN13: x.ISBN13 });

    try {
      await axios.get(urlProductSKU, tiendaNube.authConfig);
      await toggleStore(x);
    } catch (err) {
      const urlNewProduct = setTNURL(`/products/`);
      const GOODREADS_KEY = 'mhLZLtxKDFFpXQIBhSH8w';
  
      try {
        const bookAPIGR = await axios.get(`https://www.goodreads.com/book/isbn/${x.ISBN13}?format=xml&key=${GOODREADS_KEY}`);
        const GRData = (JSON.parse(convert.xml2json(bookAPIGR.data, { compact: true, spaces: 4 }))).GoodreadsResponse.book;
  
        const author = setAuthorDB();
        const BDFLink = `https://www.bookdepository.com/search?searchTerm=${x.ISBN13}`;
        
        const model = [ ".biblio-info > li ($ | trim)" ];
  
        const BDScrapy = fetch(BDFLink)
        .then(res => res.text())
        .then(body => {
          const results = scrapy.extract(body, model);
          const rawDimensions = results.filter(x => x.includes('Dimensions'))[0];
  
          const trimDimensions = rawDimensions.replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g,"").replace('Dimensions','');
          const bookData = trimDimensions.split('|');
  
          return [BDFLink, bookData[0], bookData[1]];
        })
  
        const [brand, dimensions, weight] = await BDScrapy;
        
        const weightFL = parseInt(weight.slice(0,-1)) / 1000;
        const dimensionsArr = dimensions.split("x");
        const width = parseInt(dimensionsArr[0]) / 10;

        let height, depth;
        
        switch (dimensionsArr.length) {
          case 2:
            depth  = parseInt(dimensionsArr[1].slice(0,-2)) / 10;
            height = 24;
            break;
          
            case 3:
            height = parseInt(dimensionsArr[1]) / 10;
            depth = parseInt(dimensionsArr[2].slice(0,-2)) / 10;
            break;
        }
  
        try {
          const newProduct = await axios.post(urlNewProduct, {
            "name": { "es": x.title },
            "description": {
              "es": description ({ 
                publisher: x.DScollection.publisher.title,
                pages: x.pages,
                format: setFormatDB(x.format),
                language: setLanguagueDB(x.DScollection.language),
                description: GRData.description._cdata,
                ISBN13: x.ISBN13,
                dimensions: setDimensionsDB(dimensions),
                weight,
                author
              })
            },
            "handle":{ "es": x.ISBN13 },
            "attributes": [
              { "es":"Idioma" },
              { "es":"Formato" },
              { "es":"Condición de Stock" }
            ],
            "published": false,
            "free_shipping": false,
            "requires_shipping": true,
            "canonical_url": `https://deluxe-books.com/productos/${x.ISBN13}/`,
            "brand": brand,
            "variants": [{
                "price": "10.00",
                "promotional_price": null,
                "stock_management": true,
                "stock": 10000,
                "weight": weightFL,
                "width": width,
                "height": height,
                "depth": depth,
                "sku": x.ISBN13,
                "values":[
                  { "es": setLanguagueDB(x.DScollection.language) },
                  { "es": setFormatDB(x.format) },
                  { "es":"Artículo Importado" }
                ],
                "barcode": x.ISBN13,
            }],
            "categories": [4784743]
          }, tiendaNube.authConfig)
    
          const urlNewProductCover = setTNURL(`/products/${newProduct.data.id}/images`);
    
          await axios.post(urlNewProductCover, {
              "filename": `${x.ISBN13}.png`,
              "position": 1,
              "attachment": cover
          }, tiendaNube.authConfig)

          await toggleStore(x);
        } catch (err) {
          console.log('Ya en TN');
        }
  
        console.log(`LIBROS COMPLETADOS: ${i+1} de ${books.length}`)
      } catch (err) {
        console.log(err);
        continue;
      }
    }
  }
  res.send(books.map(x => { return { ISBN13: x.ISBN13, title: x.title }}));
};

exports.addDescriptionAuthor = async (req, res) => {
  const GOODREADS_KEY = 'mhLZLtxKDFFpXQIBhSH8w';
  const model = [ ".biblio-info > li ($ | trim)" ];

  const setFormatDB = (format) => format == 'Hardback' ? 'Tapa Dura' : 'Tapa Blanda';
  const setLanguagueDB = (language) => language == 'English' ? 'Inglés' : language == 'Spanish' ? 'Español' : language;
  const setDimensionsDB = (dimensions) => dimensions.split("x").map(x => ` ${x} x`).join().replace(',','').slice(1,-1);

  const BDScrapy = (link) => fetch(link)
  .then(res => res.text())
  .then(body => {
    const results = scrapy.extract(body, model);
    const rawDimensions = results.filter(x => x.includes('Dimensions'))[0];

    const trimDimensions = rawDimensions.replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g,"").replace('Dimensions','');
    const bookData = trimDimensions.split('|');

    return [bookData[0], bookData[1]];
  });

  const description = (data) => `
  <style type=\"text/css\">
    .test {\r\n
      box-sizing: border-box;\r\n    
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\r\n
      letter-spacing: 0.48px;\r\n
      margin: 12px 0px;\r\n
      line-height: 25px;\r\n
      font-size: 17px;\r\n
      color: rgb(0, 0, 0);\r\n}\r\n\r\n
    .strongStyles {\r\n
      color: rgb(0, 0, 0);\r\n
      font-size: 17px;\r\n
      letter-spacing: 0.48px;\r\n}\r\n\r\n
    .detailsStyles {\r\n
      box-sizing: border-box;\r\n
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\r\n
      letter-spacing: inherit;\r\n}\r\n\r\n
    .details2Styles {\r\n
      box-sizing: border-box;\r\n
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\r\n
      letter-spacing: inherit;\r\n
      vertical-align: baseline;\r\n}\r\n
  </style>\r\n
    
  <p class=\"spec test\">
    <strong class=\"strongStyles\">ESPECIFICACIONES DEL PRODUCTO:</strong></p>\r\n\r\n
    <hr />\r\n
    <p class=\"spec test\">
      <span class=\"detailsStyles\">Autor: ${data.author}</span><br />\r\n
      <span class=\"detailsStyles\">Editorial: ${data.publisher}</span><br />\r\n
      <span class=\"detailsStyles\">Idioma: ${data.language}</span><br />\r\n
      <span class=\"detailsStyles\">Formato:&nbsp;<span class=\"details2Styles\">${data.format}</span></span><br />\r\n
      <span class=\"detailsStyles\">ISBN:&nbsp;</span>${data.ISBN13}<br />\r\n
      <span class=\"detailsStyles\">N&uacute;mero de P&aacute;ginas:&nbsp;<span class=\"details2Styles\">${data.pages}</span></span><br />\r\n
      <span class=\"detailsStyles\">Peso: ${data.weight}</span><br />\r\n
      <span class=\"detailsStyles\">Dimensiones:&nbsp;</span>${data.dimensions}
    </p>\r\n\r\n
    <p class=\"spec test\" style=\"margin-top: 40px !important;\">
      <strong class=\"strongStyles\">VISI&Oacute;N GENERAL:</strong>
    </p>\r\n\r\n
    <hr />\r\n
    <div class=\"test\" style=\"text-align: justify\">\r\n${data.description}</div>\r\n`

  fs.createReadStream('test.csv')
  .pipe(utf8())
  .pipe(csv({ separator: ';' }))
  .on('data', async (row) => {
    try {
      const book = (await Book.find({ ISBN13: row.SKU })
      .populate({ 
        path: 'DScollection',
        populate: {
          path: 'publisher',
          model: 'Publisher'
        }
      }))[0];

      const bookAPIGR = await axios.get(`https://www.goodreads.com/book/isbn/${book.ISBN13}?format=xml&key=${GOODREADS_KEY}`);
      const GRData = (JSON.parse(convert.xml2json(bookAPIGR.data, { compact: true, spaces: 4 }))).GoodreadsResponse.book;
      const author = Array.isArray(GRData.authors.author) ? GRData.authors.author[0].name._text : GRData.authors.author.name._text;

      const BDFLink = `https://www.bookdepository.com/search?searchTerm=${book.ISBN13}`;
      const [dimensions, weight] = await BDScrapy(BDFLink);
      console.log(dimensions, weight);

      const newDescription = description ({ 
        publisher: book.DScollection.publisher.title,
        pages: book.pages,
        format: setFormatDB(x.format),
        language: setLanguagueDB(book.DScollection.language),
        description: GRData.description._cdata,
        ISBN13: book.ISBN13,
        dimensions: setDimensionsDB(dimensions),
        weight,
        author
      });

      console.log(newDescription);
      //console.log(row.Descripción.slice(752, -1))
      //console.log(row.Descripción.splice(823, 0, authorSpan))
    } catch (err) {
      console.log(err);
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
}

