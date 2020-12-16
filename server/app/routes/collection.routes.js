const controller = require("../controllers/collection.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/collections/:id", controller.findOne);
  app.post("/api/collections/add", controller.add);
  app.get("/api/collections/addCollection/:id", controller.create);
  
  app.post("/api/collections", controller.findAll);
};