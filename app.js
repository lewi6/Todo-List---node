var express        = require("express");
var mongoose       = require("mongoose"),
    bodyParser     = require("body-parser"),
    app            = express(),
    methodOverride = require("method-override"),
    Todo           = require("./views/models/todo"),
    indexRoutes    = require("./routes/index"),
    todoRoutes     = require("./routes/todos");
var  csv    = require('csv-express');
    


//   APP CONFIG
mongoose.connect("mongodb://localhost/todo_app",{ useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.json());


// // export csv file
app.get('/export', function(req, res, next) {
  console.log("Export")
  var filename   = "todo.csv";
  Todo.find().lean().select("title description priority created modified").exec({}, function(err, todos) {
    if(err) 
      res.send(err);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader("Content-Disposition", 'attachment; filename='+filename);
    res.csv(todos, true);
  });
});



app.use(indexRoutes);
app.use("/todos", todoRoutes);

// server listening
app.listen(9999, ()=>{
 console.log("Server is running on 9999");
})