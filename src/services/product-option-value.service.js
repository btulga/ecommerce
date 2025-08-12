const {
  ProductOptionValue
} = require('../models');

const create = async (data) => {
  try {
    const productOptionValue = await ProductOptionValue.create(data);
    return productOptionValue;
  } catch (error) {
    throw new Error('Error creating product option value: ' + error.message);
  }
};

const find = async (query = {}) => {
  try {
    const productOptionValues = await ProductOptionValue.findAll({
      where: query
    });
    return productOptionValues;
  } catch (error) {
    throw new Error('Error finding product option values: ' + error.message);
  }
};

const findOne = async (query = {}) => {
  try {
    const productOptionValue = await ProductOptionValue.findOne({
      where: query
    });
    return productOptionValue;
  } catch (error) {
    throw new Error('Error finding product option value: ' + error.message);
  }
};

const update = async (id, data) => {
  try {
    const productOptionValue = await ProductOptionValue.findByPk(id);
    if (!productOptionValue) {
      throw new Error('Product option value not found');
    }
    await productOptionValue.update(data);
    return productOptionValue;
  } catch (error) {
    throw new Error('Error updating product option value: ' + error.message);
  }
};

const remove = async (id) => {
  try {
    const productOptionValue = await ProductOptionValue.findByPk(id);
    if (!productOptionValue) {
      throw new Error('Product option value not found');
    }
    await productOptionValue.destroy();
    return {
      message: 'Product option value deleted successfully'
    };
  } catch (error) {
    throw new Error('Error deleting product option value: ' + error.message);
  }
};

module.exports = {
  create,
  find,
  findOne,
  update,
  remove,
};