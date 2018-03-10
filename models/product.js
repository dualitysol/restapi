const mongoose = require('mongoose');

const productSchema = mongoose.Schema({ // Создаем модель(схему) продукта(фактически это документ)
  _id: mongoose.Schema.Types.ObjectId, // создаем уникальный ИД для каждого из продуктов, который храниться и готов к использованию
  name: { type: String, required: true }, // создаем поле имени(названия) продукта и задаем его как обязательное к заполнению при загрузке в БД
  price: { type: Number, required: true }, // тоже самое, что и с названием продукта, только численного типа
  productImage: { type: String}
});

module.exports = mongoose.model('Product', productSchema); // экспортируем нашу схему(модель) как модуль
