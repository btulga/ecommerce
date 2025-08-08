const { ProductOption } = require('../models');

class ProductOptionService {
  async create(data) {
    try {
      const productOption = await ProductOption.create(data);
      return productOption;
    } catch (error) {
      throw new Error('Error creating product option: ' + error.message);
    }
  }

  async find(query = {}) {
    try {
      const productOptions = await ProductOption.findAll({ where: query });
      return productOptions;
    } catch (error) {
      throw new Error('Error finding product options: ' + error.message);
    }
  }

  async findOne(query) {
    try {
      const productOption = await ProductOption.findOne({ where: query });
      return productOption;
    } catch (error) {
      throw new Error('Error finding product option: ' + error.message);
    }
  }

  async update(id, data) {
    try {
      const productOption = await ProductOption.findByPk(id);
      if (!productOption) {
        return null; // Or throw an error
      }
      await productOption.update(data);
      return productOption;
    } catch (error) {
      throw new Error('Error updating product option: ' + error.message);
    }
  }

  async delete(id) {
    try {
      const productOption = await ProductOption.findByPk(id);
      if (!productOption) {
        return null; // Or throw an error
      }
      await productOption.destroy();
      return { message: 'Product option deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting product option: ' + error.message);
    }
  }
}

module.exports = new ProductOptionService();