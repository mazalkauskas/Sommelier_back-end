const express = require('express');
const mySQL = require('mysql2/promise');
const isLoggedIn = require('../middleware/auth');
const { mySQLConfig } = require('../config');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const con = await mySQL.createConnection(mySQLConfig);
    const [data] = await con.execute(`
    SELECT title,region, quantity FROM collections
    JOIN wines ON (collections.wine_id=wines.id)
    WHERE user_id = ${req.user.accountId}
    `);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'Server issue occured. Please try again' });
  }
});

router.post('/', isLoggedIn, async (req, res) => {
  try {
    const con = await mySQL.createConnection(mySQLConfig);
    const [data] = await con.execute(`
        UPDATE collections
        SET quantity = quantity + ${mySQL.escape(req.body.quantity)}
        WHERE user_id = ${mySQL.escape(req.user.accountId)}
        AND wine_id = ${mySQL.escape(req.body.wine_id)}
        `);

    if (data.affectedRows === 0) {
      await con.execute(`
    INSERT INTO collections (user_id, wine_id, quantity)
    VALUES(
    ${mySQL.escape(req.user.accountId)},
    ${mySQL.escape(req.body.wine_id)},
    ${mySQL.escape(req.body.quantity)}
        )`);
    }

    await con.end();

    return res.send({ msg: 'Your wine collection succesfully updated' });
  } catch (err) {
    if (err.errno === 3819) {
      return res.status(400).send({ err: 'Your wine stocks are insufficient' });
    }
    return res.status(500).send({ err: 'Server issue occured. Please try again' });
  }
});

module.exports = router;
