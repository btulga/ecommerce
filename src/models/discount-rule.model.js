const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class DiscountRule extends Model {
    static associate(models) {
      // Existing associations will be preserved here
      
      // A discount rule can be valid for specific customers
      DiscountRule.belongsToMany(models.Customer, {
        through: 'discount_rule_customers',
        foreignKey: 'discount_rule_id',
        as: 'valid_customers'
      });

      // We should also add other existing associations here if they exist
      // For example, with Product and SalesChannel
      DiscountRule.belongsToMany(models.Product, {
        through: 'discount_rule_products',
        foreignKey: 'discount_rule_id'
      });

      DiscountRule.belongsToMany(models.SalesChannel, {
        through: 'discount_rule_sales_channels',
        foreignKey: 'discount_rule_id',
        as: 'sales_channels'
      });
    }
  }

  DiscountRule.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('percentage', 'fixed', 'free_shipping'),
      allowNull: false,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Value of the discount. E.g., 20 for 20% or 2000 for a fixed 20.00 amount.'
    },
    allocation: {
      type: DataTypes.ENUM('total', 'item'),
      allowNull: true,
      comment: 'Defines if the discount is applied to the total cart or a specific item.'
    }
  }, {
    sequelize,
    modelName: 'DiscountRule',
    tableName: 'discount_rules',
    timestamps: true,
  });

  return DiscountRule;
};
