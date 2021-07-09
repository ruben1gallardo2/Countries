require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_URI
} = process.env;

const sequelize = new Sequelize(`${DB_URI}`, {
  logging: false, // set to console.log to see the raw SQL queries postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/countries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  dialect: "postgres",
  ssl: true, 
  dialectOptions: {
    ssl: {
      require:true,
      rejectUnauthorized: false
    },
  } 
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Countries, Turisms } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
Countries.belongsToMany(Turisms, { through: 'countriesTurisms' })
Turisms.belongsToMany(Countries, { through: 'countriesTurisms' })

// turisms_id | countries_id
// 1 = playa        VEN
// 1             constants
// 1 
// 1
// 1  filtrado por redux, usando tabla intermedia para filtrar por turismo
// ver en documentacion de seq, como acceder a propiedades de tabla intermedias

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
