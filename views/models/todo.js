var mongoose = require("mongoose");

var todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: Number,
  created:{type: Date, default: Date.now},
  modified: {type: Date}
})

var Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;