const controller = require("../controllers/work.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.post("/api/works", controller.findAll);
  app.post("/api/works/add", controller.add);
  app.post("/api/works/update", controller.update);
};