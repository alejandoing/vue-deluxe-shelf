const controller = require('../controllers/book.controller');
const multer = require('multer');

const upload = multer({ dest: '../server/app/uploads/books' });

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.post("/api/books", controller.findAll);
  app.post("/api/books/add", upload.single('file'), controller.add);
  app.post("/api/books/update", upload.single('file'), controller.update);
  app.get("/api/books/send", controller.send);
  app.get("/api/books/addDescriptionAuthor", controller.addDescriptionAuthor)
};