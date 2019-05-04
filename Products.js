var mongoose = require('mongoose');
var Schema = mongoose.Schema; // <-- EDIT: missing in the original post
var ProductsSchema = new Schema({
    name : String,
  	description : String,
  	price : Number
});
var Products = mongoose.model("Products", ProductsSchema);

module.exports = Products;