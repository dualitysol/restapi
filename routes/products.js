const express = require('express');
var app = express();
var router = express.Router();
const mongoose = require('mongoose'); // загружаем ОДМ для работы с МонгоДБ
const products_url = "http://localhost:3001/products/"; // Make our url as a domain
const Product = require('../models/product'); // загружаем модель(схему) продукта для обмена данными с базой и создании в ней документов в виде нашей модели(схеме) продукта

router.get('/', (req, res, next) => {  // роутер ГЕТ запроса
  Product.find() // Осуществляем поиск всех документов(продуктов в данном случае) в базе
    .select('name price _id')
    .exec() // создаем что-то вроде "промисса"
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: 'GET',
              url: products_url + doc._id
            }
          }
        })
      };
      res.status(200).json(response); // отдаем клиенту все документы(продукты) в виде json
    })
    .catch(err => { // пытаемся словить ошибку, если она есть
      console.log(err); // выводим ее в терминал
      res.status(500).json({ // отдаем ошибку клиенту в виде json
        error: err
      });
    })
});

router.post('/', (req, res, next) => { // роутер ПОСТ запроса
  const product = new Product ({ // Конструктор экзепляра продукта (_ИД в базе, имя, цена)
    _id: new mongoose.Types.ObjectId(), // формирует новый уникальный ИД в МонгоДБ для нашего продукта
    name: req.body.name, // устанавливает название заданное ПОСТ запросом
    price: req.body.price // устанавливает цену заданную ПОСТ запросом
  });
  product // вызов экземпляра
    .save() // сохраняем созданный экземпляр продукта. save() это mongoose модуль, который заносит данные в МонгоДБ
    .then( result => {
      console.log(result); // выводим результат(ПОЛУЧЕННЫЙ ИЗ БД) в терминал ( для логгирования)
      res.status(201).json({
        message: `Product ${result.name} has been created!`,
        createdProduct: {
          price: result.price,
          _id: result._id,
          request: {
            link: products_url + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    }); // пытаемся словить ошибки, если получается, то выводим в терминал

});

router.get('/:productID', (req, res, next) => { // отправляем данные конкретного продукта(по ИД)
  var id = req.params.productID; //устанавливаем ИД по полученному от клиента
  Product.findById(id) //ф-ия поиска по ИД
    .select('name price _id')
    .exec() // ее выполнение
    .then(doc => {
      console.log('From DB: ', doc); // выводим данные из базы в терминал
      if (doc) { //если данные в базе есть
        res.status(200).json(doc) // отдаем json объект с данными(запрашиваемый продукт) клиенту
      } else { // если данных нет
        res.status(404).json({ message: 'No valid entry found for provided ID' }); // отдаем ошибку 404. Говорим клиенту, что введенный ИД не соответсвует данным в базе
      }
    })
    .catch(err => { // ловим ошибку, если она есть
      console.log(err); // выводим ее в терминал
      res.status(500).json({error: err}) // выводим ошибку клиенту
    });
});

router.patch('/:productID', (req, res, next) => {
  const id = req.params.productID; // ID параметр получаемый по ссылке запроса
  const updateOps = {}; // создаем пустой объект, который будем начинять параметрами, которые будем изменять в базе
  for (const ops of req.body) { // создаем цикл в котором опс будем являться телом данных полученным ПАТЧ запросом
    updateOps[ops.propName] = ops.value; // создаем массив аргумент которого равен свойству объекта из базы, значение которого будем изменять, а валью собсвтенно это зачение, который мы задает клиент
  }
  Product.update({ _id: id}, { $set: updateOps }) // _ид: ид - замораживаем значение ИД объекта в базе. сет: апдейтОпс - устанавливает новые значения полученные от клиента, вместо тех что были ранее
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
  });
});

router.delete('/:productID', (req, res, next) => { //удаляем данные продукта
  const id = req.params.productID; // задаем ИД
  Product.remove({ _id: id }) // удаляем документ по заданному ИД
    .exec() // типа промиса
    .then( result => {
      res.status(200).json({
        message: "Product deleted!"
      }) // отдаем результат клиенту в json
    })
    .catch(err => { // ловим ошибку, если есть
      res.status(500).json({ // отдаем ошибку 500
        error: err // сообщение об ошибке из mongoose
      });
    });
  // res.status(200).json({
  //   message: 'Deleted product!'
  // });
});

module.exports = router; // экспортируем модуль нашего продукт-роутера для вызова
