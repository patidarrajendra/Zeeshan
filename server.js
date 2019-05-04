var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var Products = require('./Products');
var Cart = require('./Cart');
var bodyParser = require('body-parser');
const v = require('node-input-validator');
const path = require('path');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data

// app.use(bodyParser.urlencoded({ extended: true }));


app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.set('Access-Control-Allow-Credentials', 'true');
  next();
});

// Point static path to dist
app.use('/',express.static(path.join(__dirname,'/mean-app/dist/')));
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

mongoose.connect('mongodb://localhost:27017/product_app', options, function(error) {
    if(error){
      console.log('Error in Monogdb Connection is : ', error);
    } else {
      console.log('Monogdb Connected Successfully');
    }
});

app.post('/save_product', function(req, resp){
  let validator = new v( req.body, {
        name:'required',
        description: 'required',
        price: 'required|integer'
    });
 
    validator.check().then(function (matched) {
        if (!matched) {
            res.status(422).send(validator.errors);
        } else {
      var product = new Products();
      product.name = req.body.name;
        product.description = req.body.description;
        product.price = req.body.price;

        product.save(function(err, data){
          if(err){
            resp.json({status : false, msg : 'Error in Saving Product'});
          } else {
            resp.json({status : true, msg : 'Product Saved Successfully'});
          }
        });
        }
    });
});

app.get('/get_procuts', function(req, resp){
  Products.find({}, function(err, data){
    if(err){
      resp.json({status : false, msg : ' No Product Found'});
    } else if(data.length == 0){
      resp.json({status : false, msg : ' No Product Found'});
    } else {
      resp.json({status : true, msg : data});
    }
  });
})

app.get('/get_carts', function(req, resp){
  Cart.find({}, function(err, data){
    if(err){
      resp.json({status : false, msg : ' No Product Found'});
    } else if(data.length == 0){
      resp.json({status : false, msg : ' No Product Found'});
    } else {
      resp.json({status : true, msg : data});
    }
  });
})

app.post('/remove_from_cart', function(req, resp){
  Cart.remove({ _id: req.body._id }, function(err) {
      if(err){
      resp.json({status : false, msg : 'Error in Removing Product'});
    } else {
      resp.json({status : true, msg : 'Product Removed Successfully'});
    }
  });
});

app.post('/add_to_Cart', function(req, resp){
  let validator = new v( req.body, {
        ProductId:'required',
        product_name : 'required',
        quantity: 'required|integer',
        price: 'required|integer'
    });
 
    validator.check().then(function (matched) {
        if (!matched) {
          resp.status(422).send(validator.errors);
        } else {
          Cart.updateOne(
            { ProductId: req.body.ProductId },
            {
              $set: { product_name: req.body.product_name },
              $inc: { quantity: req.body.quantity, price: req.body.price } 
            }, {new: true, upsert : true}, function(err, data){
              if(err){
                resp.json({status : false, msg : 'Error in Saving Product'});
              } else {
                resp.json({status : true, msg : 'Product Saved Successfully', response : data});
              }
            }
          )
        }
    });
})

app.listen(port, function(){
  console.log('Node Server Listening on ', port, ' Port');
});