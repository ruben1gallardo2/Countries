const { Router } = require('express');
const { Op } = require('sequelize')
const fetch = require('node-fetch');
const { Countries, Turisms, countriesTurisms } = require('../db.js');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const api_id = "https://restcountries.eu/rest/v2/alpha/{code}"
const api = "https://restcountries.eu/rest/v2/all"

const router = Router();

//funcion para llenar tablas con datos de la api, solo los que necesito
const fillTables = async () => {
  let ruta = api

  let result = null
  try {
    result = await fetch(ruta)
    result = await result.json()
  } catch (e) {
    return false
  }

  let countries_detail = result.map(async val => {
    let result_tables = null
    try {
      result_tables = await Countries.create({
        id: val.alpha3Code,
        name: val.name,
        flag_image: val.flag,
        continent: val.region,
        capital: val.capital,
        subregion: val.subregion,
        area: val.area,
        population: val.population
      })
    } catch (e) {
      return null
    }
    return result_tables;
  })
  return countries_detail;
}
fillTables();
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get('/countries/:code', async (req, res) => {
  const { code } = req.params;

  try {
    let result = null
    result = await Countries.findOne({
      where: {
        id: `${code}`
      },
      include: [
        {
          model: Turisms,
          through: { attributes: [] }
        }
      ]
    });
    if (!result) throw new Error("Country not found")
    res.json(result);
  } catch (e) {
    res.status(404).send({ message: "Country not found" })
    console.log(e)
  }
});

router.get('/countries', async (req, res) => {
  let query = req.query || { page: 1, name: "", continent: "", limit: 8, order: [["name", "ASC"]] };
  let pag = query.page ? query.page : 1;
  let lim = query.limit || 8;

  const queries_seq = {
    attributes: ["flag_image", "name", "continent"],
    limit: lim,
    offset: (pag - 1) * lim
  }
  if (!!query.name || !!query.continent) {
    queries_seq.where = {
      [Op.or]: [
        {
          name: {
            [Op.iLike]: `%${query.name}%`
          }
        },
        {
          continent: {
            [Op.iLike]: `%${query.continent}%`
          }
        }
      ]
    }
  }
  if (!!query.order && !!query.type) {
    queries_seq.order = [
      [query.type, query.order]
    ]
  }
  try {
    let query_result = await Countries.findAll(queries_seq)
    res.json(query_result)
  } catch (e) {
    res.status(404).send({ message: "Country not found" })
  }
});

router.post('/activity', async (req, res) => {
  const { country, ...data } = req.body;

  try {
    let post = await Turisms.create(data);

    if (country && country.length > 0) {
      post.setCountries(country)
    }

    res.status(200).json(post, { message: "Created successfully" })
  } catch (e) {
    res.status(500).json({ message: "Could not be created" })
  }
});

// router.delete('/activity/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     let result = await Turisms.delete({
//       where: { id }
//     })
//     res.status(200).json(result)
//   } catch (e) {
//     res.status(404).json({ message: "Activity not found" })
//   }
// })

router.get('/activity', async (req, res) => {
  try {
    let results = await Turisms.findAll()
    res.status(200).json(results)
  } catch (e) {
    res.status(404).json({ message: "Activities not found" })
  }
})

module.exports = router;
