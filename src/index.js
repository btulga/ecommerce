const express = require('express');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
const categoryRoutes = require('./routes/category-routes');
const collectionRoutes = require('./routes/collection-routes');
const discountRoutes = require('./routes/discount-routes');
const locationRoutes = require('./routes/location-routes');
const inventoryRoutes = require('./routes/inventory-routes');
const couponRoutes = require('./routes/coupon-routes');
const campaignRoutes = require('./routes/campaign-routes');
const promotionRoutes = require('./routes/promotion-routes');
const customerGroupRoutes = require('./routes/customer-group-routes');
const customerSalesChannelRoutes = require('./routes/customer-sales-channel-routes');
const adminAuthRoutes = require('./routes/admin-auth-routes');

app.use('/api', categoryRoutes);
app.use('/api', collectionRoutes);
app.use('/api', discountRoutes);
app.use('/api', locationRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', couponRoutes);
app.use('/api', campaignRoutes);
app.use('/api', promotionRoutes);
app.use('/api', customerGroupRoutes);
app.use('/api', customerSalesChannelRoutes);
app.use('/api', adminAuthRoutes);

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
