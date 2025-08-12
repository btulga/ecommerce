'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Product has many Variants
      Product.hasMany(models.ProductVariant, {
        foreignKey: 'product_id',
        as: 'variants'
      });

      // Product belongs to one Collection
      Product.belongsTo(models.ProductCollection, {
        foreignKey: 'collection_id',
        as: 'collection'
      });

      // Product has many Tags through a join table
      Product.belongsToMany(models.ProductTag, {
        through: 'product_tags',
        foreignKey: 'product_id',
        as: 'tags'
      });
      
      // Product can be part of many Discount Rules
      Product.belongsToMany(models.DiscountRule, {
        through: 'discount_rule_products',
        foreignKey: 'product_id'
      });
      
      // Product has many Categories through ProductCategory
      Product.belongsToMany(models.Category, {
        through: models.ProductCategory,
        foreignKey: 'product_id'
      });
    }
  }

  // Method to calculate the price for a customer considering discount rules
  Product.prototype.getPriceForCustomer = async function(customerId, models) {
    // Assume 'this' is the Product instance
    // Assume you have a way to get the customer and their groups
    const customer = await models.Customer.findByPk(customerId, {
      include: [{
        model: models.CustomerGroup,
        through: models.CustomerGroupCustomer,
        as: 'customer_groups'
      }]
    });

    let discountedPrice = this.price; // Assume product has a base price field

    if (customer && customer.customer_groups && customer.customer_groups.length > 0) {
      // Find active discount rules for the customer's groups that apply to this product
      const activeDiscountRule = await models.DiscountRule.findOne({
        include: [{
          model: models.CustomerGroup,
          through: models.DiscountRuleCustomerGroup,
          as: 'customer_groups',
          where: { id: customer.customer_groups.map(group => group.id) }
        }, {
          model: models.Product,
          through: models.DiscountRuleProduct,
          where: { id: this.id }
        }],
        where: {
          start_date: { [models.Sequelize.Op.lte]: new Date() },
          end_date: { [models.Sequelize.Op.gte]: new Date() }
        }
      });

      if (activeDiscountRule && activeDiscountRule.discount_percentage) {
        discountedPrice = this.price * (1 - activeDiscountRule.discount_percentage / 100);
      }
    }

    return discountedPrice;
  };

  Product.init({
    // Keeping your existing fields
    id: { // Added ID for consistency
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    handle: { // URL friendly string
        type: DataTypes.STRING,
        unique: true
    },
    is_giftcard: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft'
    },    
    category_id: {
      type: DataTypes.UUID,
      references: {
        model: 'product_categories', // Assuming the table name is 'product_categories'
        key: 'id',
      },
    }, // Added foreign key for product category
    type: DataTypes.STRING, // Added field for product type
    price: DataTypes.DECIMAL(10, 2) // Assuming a price field exists
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products'
  });
  return Product;
};
