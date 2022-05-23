const express = require('express');
const mySQL = require('mysql2/promise');
const bcrypt = require('bcrypt');
// const jsonwebtoken = require('jsonwebtoken');
// const isLoggedIn = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const { mySQLConfig, jwtSecret } = require('../config');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const con = await mySQL.createConnection(mySQLConfig);
    const [data] = await con.execute(`
    INSERT INTO users (name, email, password)
    VALUES (${mySQL.escape(req.body.name)}, ${mySQL.escape(req.body.email)}, '${hash}')
    `);
    await con.end();

    if (!data.insertId) {
      return res.status(500).send({ err: 'Server issue occured. Please try again' });
    }

    return res.send({ msg: 'Succesfully created account' });
  } catch (err) {
    return res.status(500).send({ err: 'Server issue occured. Please try again' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const con = mySQL.createConnection(mySQLConfig);
    const [data] = await con.execute(`
    SELECT id, password
    FROM users 
    WHERE email = ${req.body.email}
    LIMIT 1
    `);
    await con.end();

    if (data.length === 0) {
      res.send(400).status({ err: 'User not found' });
    }

    if (!bcrypt.compareSync(req.body.password, data[0].password)) {
      return res.status(400).send({ err: 'Incorrect password' });
    }

    const token = jwt.sign({ accountId: data[0].id }, jwtSecret);

    return res.send({ msg: 'Succesfully logged in ', token });
  } catch (err) {
    return res.status(500).send({ err: 'Server issue occured. Please try again' });
  }
});

module.exports = router;
