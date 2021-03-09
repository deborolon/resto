const Sequelize = require('sequelize');
const database = 'delilah';
const user = 'root';
const password = '';
const host = 'localhost';
const port = 3306;

const sq = new Sequelize(`mysql://${user}:${password}@${host}:${port}/${database}`);

const db = (async () => {
    try {
        await sq.authenticate()
        console.log('Database connection succededed');

      } catch (err) {
        console.error('Database connection failed', err);
      }
})

db();

module.exports.sq = sq;