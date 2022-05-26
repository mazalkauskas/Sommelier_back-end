const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const winesRoutes = require('./routes/wines');
const collectionRoutes = require('./routes/collections');
const { serverPort } = require('./config');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send({ msg: 'Server is running' });
});

app.use('/', userRoutes);
app.use('/wines/', winesRoutes);
app.use('/my-wines', collectionRoutes);

app.all('*', (req, res) => {
  res.status(404).send({ err: 'Page not found' });
});

app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});
