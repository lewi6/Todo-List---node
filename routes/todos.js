var express = require("express");
var router  = express.Router();
var Todo    = require("../views/models/todo");
var  csv    = require('csv-express');
var  { body, validationResult } = require('express-validator');

//display all todos
router.get("/",(req,res)=>{
  Todo.find({}, (err, todos)=>{
    if(err){
      console.log("ERROR !");
    } else {
      res.render("index",{todos:todos});
    }
  })
});

//Route to insert a todo
router.post("/",
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
router.get("/new", (req, res) => {
  res.render("new");
})

//show one todo
router.get("/:id",(req,res)=>{
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
router.delete("/:id",(req, res) => {
  Todo.findByIdAndRemove(req.params.id,(err) =>{
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("blogs");
    }
  }) 
});

// edit todo form
router.get("/:id/edit", (req, res) => {
  Todo.findById(req.params.id,(err, fndtodo) => {
    if(err){
      redirect("/todos");
    } else {
      res.render("edit",{todo: fndtodo})
    }
  });
});

// update a particular todo
router.put("/:id", 
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
router.get('/ext', (req, res, next) => {
  console.log("Yooooo")
  var filename   = "todo.csv";
  Todo.find().lean().select("title description priority created modified").exec({}, (err, todos) => {
      if(err) 
        res.send(err);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader("Content-Disposition", 'attachment; filename='+filename);
      res.csv(todos, true);
  });
});

// search by title
router.post('/search', (req,res) => {
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

module.exports = router;