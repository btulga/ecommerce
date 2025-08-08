const {
  ProductCategory
} = require('../models');

class ProductCategoryService {
  /**
   * Creates a new product category.
   * @param {object} data - The data for the new product category.
   * @returns {Promise<ProductCategory>} The created product category.
   */
  async create(data) {
    return ProductCategory.create(data);
  }

  /**
   * Finds all product categories.
   * @param {object} options - Options for the find operation.
   * @returns {Promise<Array<ProductCategory>>} An array of product categories.
   */
  async findAll(options = {}) {
    return ProductCategory.findAll(options);
  }

  /**
   * Finds a product category by its ID.
   * @param {string} id - The ID of the product category.
   * @returns {Promise<ProductCategory|null>} The product category if found, otherwise null.
   */
  async findById(id) {
    return ProductCategory.findByPk(id);
  }

  /**
   * Updates a product category.
   * @param {string} id - The ID of the product category to update.
   * @param {object} data - The update data.
   * @returns {Promise<Array<number>>} The number of affected rows.
   */
  async update(id, data) {
    return ProductCategory.update(data, {
      where: {
        id
      }
    });
  }

  /**
   * Deletes a product category.
   * @param {string} id - The ID of the product category to delete.
   * @returns {Promise<number>} The number of destroyed rows.
   */
  async delete(id) {
    return ProductCategory.destroy({
      where: {
        id
      }
    });
  }
}

module.exports = new ProductCategoryService();