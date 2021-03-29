var express = require("express");
var router  = express.Router();


// app.use("/todos",todoRoutes);
router.get("/",function(req, res){
  res.redirect("/todos");
})

module.exports = router;