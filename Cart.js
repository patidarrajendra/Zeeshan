var mongoose = require('mongoose');
var Schema = mongoose.Schema; // <-- EDIT: missing in the original post

var CartSchema = new Schema({
	ProductId : mongoose.ObjectId,
	product_name : String,
    quantity : Number,
  	price : Number
});
var Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;