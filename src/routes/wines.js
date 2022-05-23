const express = require('express');
const mySQL = require('mysql2/promise');
const isLoggedIn = require('../middleware/auth');
const { mySQLConfig } = require('../config');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const con = await mySQL.createConnection(mySQLConfig);
    const [data] = await con.execute(`
        SELECT * FROM wines
          `);
    await con.end();

    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'Server problem' });
  }
});

module.exports = router;
