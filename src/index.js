const express = require('express');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
const categoryRoutes = require('./routes/category-routes');
const collectionRoutes = require('./routes/collection-routes');
app.use('/api', categoryRoutes);
app.use('/api', collectionRoutes);

app.get('/', (req, res) => {
  res.send('E-commerce API is running');
});

(async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
  }
})();

module.exports = app;
