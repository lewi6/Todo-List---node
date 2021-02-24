var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app         = express(),
    csv = require('csv-express'),
    methodOverride = require("method-override"),
    Todo    = require("./views/models/todo"),
    { body, validationResult, query } = require('express-validator');


//   APP CONFIG
mongoose.connect("mongodb://localhost/todo_app",{ useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.static("public"));

app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());


// Route to root
app.get("/",(req,res)=>{
  res.redirect("/todos");
});

//Route to insert a todo
app.post("/todos",
  body('todo.title',"title required").notEmpty(),
  body('todo.description','description required').notEmpty(),
  (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("error", { mesg: errors.array() });
    }
   
   Todo.create(req.body.todo, (err, newTodo)=>{
    res.redirect("/todos");
  });
});

//insert new todo form
app.get("/todos/new", (req, res) => {
  res.render("new");
})

//display all todos
app.get("/todos",(req,res)=>{
  Todo.find({}, (err, todos)=>{
    if(err){
      console.log("ERROR !");
    } else {
      res.render("index",{todos:todos});
    }
  })
});


//show one todo
app.get("/todos/:id",(req,res)=>{
  Todo.findById(req.params.id, (err,fndtodo)=>{
    if(err){
      res.redirect("/todos");
    } else {
      console.log(fndtodo.modified)
      res.render("show", {todo:fndtodo});
    }
  });
});

//delete a todo
app.delete("/todos/:id",(req, res) => {
  Todo.findByIdAndRemove(req.params.id,(err) =>{
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("blogs");
    }
  }) 
})


// edit todo form
app.get("/todos/:id/edit", (req, res) => {
  Todo.findById(req.params.id,(err, fndtodo) => {
    if(err){
      redirect("/todos");
    } else {
      res.render("edit",{todo: fndtodo})
    }
  });
});

// update a particular todo
app.put("/todos/:id", 
  body('todo.title',"title required").notEmpty(),
  body('todo.description','description required').notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("error", { mesg: errors.array() });
    }

  Todo.findByIdAndUpdate(req.params.id,req.body.todo, (err, updtodo) => {
    if(err){
      res.redirect("/todos");
    } else {
      Todo.findById( req.params.id,  ( err, todo )=>{
        todo.modified = Date.now();
        todo.save( function ( err, todo, count ){
          res.redirect("/todos/" + req.params.id);
        });
      });
    }
  })
})

// export csv file
app.get('/export', function(req, res, next) {

  var filename   = "todo.csv";
  var dataArray;
  Todo.find().lean().select("title description priority created modified").exec({}, function(err, todos) {
      if(err) 
        res.send(err);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader("Content-Disposition", 'attachment; filename='+filename);
      res.csv(todos, true);

  });

});

// search by title
app.post('/search', (req,res) => {
  var query = {"title": req.body.look};
  console.log(query);
  Todo.find(query,(err, rslt)=> {
    if(err){
      console.log("error");
    } else {
      console.log(rslt);
      res.render("index",{todos:rslt})
    } 
  })
})

// server listening
app.listen(9999, ()=>{
  console.log("Server is running");
})