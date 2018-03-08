const express = require('express');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders')
const port = process.env.PORT || 3001;
const app = express();
const morgan = require('morgan');
var runTime = require('./micromodules/date_time.js')
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// DB connection
mongoose.connect(
  "mongodb://node-rest:node123@cluster0-shard-00-00-8z7rt.mongodb.net:27017,cluster0-shard-00-01-8z7rt.mongodb.net:27017,cluster0-shard-00-02-8z7rt.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin",
  {
    useMongoClient: true
  }
);
app.use(morgan('dev')); //logger
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST PATCH, GET, DELETE');
    return res.status(200).json({});
  }
  next(); // We need to next() cuz we locked
});

// Routes that handles requests
app.use('/products', productRoutes);
app.use('/order', orderRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
// Server run
app.listen(port);
console.log();
console.log();
console.log(`Server is on port ${port}`);
console.log();
console.log();
console.log(runTime);
console.log();
