// src/models/product-sales-channel.js
module.exports = (sequelize, DataTypes) => {
    const ProductSalesChannel = sequelize.define(
        "ProductSalesChannel",
        {
            product_id: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "products",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            sales_channel_id: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "sales_channels",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
        },
        {
            tableName: "product_sales_channels",
            timestamps: true,
            underscored: true,
        }
    );

    ProductSalesChannel.associate = (models) => {
        ProductSalesChannel.belongsTo(models.Product, {
            foreignKey: "product_id",
            as: "product",
        });

        ProductSalesChannel.belongsTo(models.SalesChannel, {
            foreignKey: "sales_channel_id",
            as: "sales_channel",
        });
    };

    return ProductSalesChannel;
};
