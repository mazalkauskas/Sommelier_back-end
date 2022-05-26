const express = require('express');
const mySQL = require('mysql2/promise');
const isLoggedIn = require('../middleware/auth');
const { mySQLConfig } = require('../config');
const validation = require('../middleware/validation');
const { winePostSchema } = require('../middleware/validationSchemas');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const con = await mySQL.createConnection(mySQLConfig);
    const [data] = await con.execute('SELECT * FROM wines');
    await con.end();

    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'Server issue occured. Please try again' });
  }
});

router.post('/', isLoggedIn, validation(winePostSchema), async (req, res) => {
  try {
    const con = await mySQL.createConnection(mySQLConfig);
    const [data] = await con.execute(`
    INSERT INTO wines (title, region, year)
    VALUES (
        ${mySQL.escape(req.body.title)},
        ${mySQL.escape(req.body.region)},
        ${mySQL.escape(req.body.year)}
    )`);

    if (!data.insertId) {
      return res.status(500).send({ err: 'Server issue occured. Please try again' });
    }

    await con.end();
    return res.send({ msg: 'Succesfully added a wine' });
  } catch (err) {
    return res.status(500).send({ err: 'Server issue occured. Please try again' });
  }
});

module.exports = router;
