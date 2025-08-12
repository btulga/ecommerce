'use strict';

const { ProductVariant, ProductOptionValue, ProductVariantOption } = require('../models');
const { v4: uuidv4 } = require('uuid');

/**
 * Creates a new product variant.
 * @param {object} data - The data for the new product variant.
 * @param {string} data.title - The title of the variant.
 * @param {string} data.sku - The SKU of the variant.
 * @param {number} data.inventory_quantity - The inventory quantity.
 * @param {string} data.product_id - The ID of the associated product.
 * @param {string[]} [data.option_value_ids] - Array of ProductOptionValue IDs associated with this variant.
 * @returns {Promise<ProductVariant>} The created product variant.
 */
const create = async (data) => {
  const { option_value_ids, ...variantData } = data;
  const productVariant = await ProductVariant.create({
    id: uuidv4(),
    ...variantData,
  });

  if (option_value_ids && option_value_ids.length > 0) {
    const variantOptions = option_value_ids.map(valueId => ({
      product_variant_id: productVariant.id,
      product_option_value_id: valueId,
    }));
    await ProductVariantOption.bulkCreate(variantOptions);
  }

  // You might want to fetch the variant with its options here
  return findById(productVariant.id);
};

/**
 * Finds a product variant by its ID.
 * @param {string} id - The ID of the product variant.
 * @returns {Promise<ProductVariant|null>} The product variant or null if not found.
 */
const findById = async (id) => {
  return ProductVariant.findByPk(id, {
    include: [{
      model: ProductOptionValue,
      as: 'option_values',
      through: { attributes: [] } // Exclude join table attributes
    }]
  });
};

/**
 * Finds all product variants.
 * @returns {Promise<ProductVariant[]>} An array of product variants.
 */
const findAll = async () => {
  return ProductVariant.findAll({
     include: [{
      model: ProductOptionValue,
      as: 'option_values',
      through: { attributes: [] }
    }]
  });
};

/**
 * Finds product variants by product ID.
 * @param {string} productId - The ID of the associated product.
 * @returns {Promise<ProductVariant[]>} An array of product variants for the given product.
 */
const findByProductId = async (productId) => {
  return ProductVariant.findAll({
    where: { product_id: productId },
    include: [{
      model: ProductOptionValue,
      as: 'option_values',
      through: { attributes: [] }
    }]
  });
};


/**
 * Updates a product variant.
 * @param {string} id - The ID of the product variant to update.
 * @param {object} data - The update data.
 * @returns {Promise<ProductVariant|null>} The updated product variant or null if not found.
 */
const update = async (id, data) => {
  const productVariant = await ProductVariant.findByPk(id);

  if (!productVariant) {
    return null;
  }

  const { option_value_ids, ...variantData } = data;

  await productVariant.update(variantData);

  if (option_value_ids !== undefined) {
      // Remove existing associations
      await ProductVariantOption.destroy({ where: { product_variant_id: id } });

      // Add new associations
      if (option_value_ids && option_value_ids.length > 0) {
          const variantOptions = option_value_ids.map(valueId => ({
              product_variant_id: id,
              product_option_value_id: valueId,
          }));
          await ProductVariantOption.bulkCreate(variantOptions);
      }
  }


  // Fetch the updated variant with its options
  return findById(id);
};

/**
 * Deletes a product variant.
 * @param {string} id - The ID of the product variant to delete.
 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
 */
const remove = async (id) => {
  const productVariant = await ProductVariant.findByPk(id);

  if (!productVariant) {
    return false;
  }

  await productVariant.destroy();
  return true;
};

module.exports = {
  create,
  findById,
  findAll,
  findByProductId,
  update,
  remove,
};