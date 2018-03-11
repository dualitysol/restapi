const express = require('express');
const productRoutes = require('./routes/products'); // Router for domain.com/products/...
const orderRoutes = require('./routes/orders') //  Router for domain.com/order/...
const port = process.env.PORT || 3001; // процесс.енв.ПОРТ используем на случай, если будем деплоить приложуху на хосте, с конкретно выделенным для нас портом
const app = express();
const morgan = require('morgan'); // подключем модуль логгера
var runTime = require('./micromodules/date_time.js') // requre timer for deploy runnig time in terminal
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const Mailer = require('./middleware/mailer');
// Подключаемся к МонгоДБ черед ОДМ Монгуз, с указанием именем и паролем админ пользователя

//mongoose.connect('mongodb://localhost:27017/restapi')

mongoose.connect(
  "mongodb://node-rest:node123@cluster0-shard-00-00-8z7rt.mongodb.net:27017,cluster0-shard-00-01-8z7rt.mongodb.net:27017,cluster0-shard-00-02-8z7rt.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"
);

//включаем логгер и парсер html и json для возможности обмена данными
app.use(morgan('dev')); // логгер
app.use(bodyParser.urlencoded({extended: false})); // модуль для парсинга html типа данных
app.use(bodyParser.json()); // модуль для приема данных json типа

// Устраняем ошибку доступа подключения с разных серверов и позволяем подключение любому клиенту вне зависимости от IP и порта
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
    return res.status(200).json({});
  }
  next(); // We need to next() cuz we locked
});

// Роутер для приема запросов
app.use('/products', productRoutes); // путь для продуктов
app.use('/orders', orderRoutes); // путь для заказов
app.use('/uploads', express.static('./uploads'));
app.use('/user', userRoutes);

// Создаем код ошибки для 404
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// создаем код ошибки 500(любого другого рода)
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
