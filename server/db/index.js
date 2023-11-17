module.exports = {
  ...require('./client'), // adds key/values from users.js
  ...require('./users'), // adds key/values from users.js
  ...require('./products'), // adds key/values from products.js
}