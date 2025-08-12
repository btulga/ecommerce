const {
  Product,
  ProductCategory
} = require('../models');

/**
 * Create a new product.
 * @param {object} productData - The product data.
 * @param {string} [productData.category_id] - Optional category ID.
 * @returns {Promise<Product>} The created product.
 */
async function createProduct(productData) {
  try {
    const product = await Product.create(productData);
    return product;
  } catch (error) {
    throw new Error('Error creating product: ' + error.message);
  }
}

/**
 * Find a product by ID.
 * @param {string} id - The product ID.
 * @param {object} [options] - Query options.
 * @returns {Promise<Product|null>} The product if found, otherwise null.
 */
async function findProductById(id, options = {}) {
  try {
    const product = await Product.findByPk(id, options);
    return product;
  } catch (error) {
    throw new Error('Error finding product: ' + error.message);
  }
}

/**
 * Find all products.
 * @param {object} [filter] - Filter criteria.
 * @param {string} [filter.category_id] - Filter by category ID.
 * @param {object} [options] - Query options.
 * @returns {Promise<Product[]>} A list of products.
 */
async function findAllProducts(filter = {}, options = {}) {
  try {
    const where = {};
    if (filter.category_id) {
      where.category_id = filter.category_id;
    }
    const products = await Product.findAll({
      where,
      ...options,
    });
    return products;
  } catch (error) {
    throw new Error('Error fetching products: ' + error.message);
  }
}

  /**
   * Update a product.
   * @param {string} id - The product ID.
   * @param {object} updateData - The data to update.
   * @returns {Promise<[number, Product[]]>} The number of updated rows and the updated products.
   */
async function updateProduct(id, updateData) {
  try {
    const updatedProduct = await Product.update(updateData, {
      where: {
        id
      },
      returning: true,
    });
    return updatedProduct;
  } catch (error) {
    throw new Error('Error updating product: ' + error.message);
  }
}

/**
 * Delete a product.
 * @param {string} id - The product ID.
 * @returns {Promise<number>} The number of deleted rows.
 */
async function deleteProduct(id) {
  try {
    const deletedRows = await Product.destroy({
      where: {
        id
      }
    });
    return deletedRows;
  } catch (error) {
    throw new Error('Error deleting product: ' + error.message);
  }
}

module.exports = {
  createProduct,
  findProductById,
  findAllProducts,
  updateProduct,
  deleteProduct,
};