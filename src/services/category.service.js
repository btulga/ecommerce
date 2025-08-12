const Category = require('../models/category.model');
const ProductCategory = require('../models/product-category.model');

const createCategory = async (categoryData) => {
  const category = new Category(categoryData);  
  await category.save();
  return category;
};

const getAllCategories = async () => {
  const categories = await Category.find();
  return categories;
};

const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

const updateCategory = async (categoryId, categoryData) => {
  const category = await Category.findByIdAndUpdate(categoryId, categoryData, { new: true });
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

const addProductToCategory = async (categoryId, productId) => {
  const [productCategory, created] = await ProductCategory.findOrCreate({
    where: {
      category_id: categoryId,
      product_id: productId,
    },
    defaults: {
      category_id: categoryId,
      product_id: productId,
    },
  });
  return productCategory; // Returns the record, whether it was found or created
};

const removeProductFromCategory = async (categoryId, productId) => {
  const result = await ProductCategory.destroy({
    where: {
      category_id: categoryId,
      product_id: productId,
    },
  });
  return result; // Number of destroyed rows
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  addProductToCategory,
  removeProductFromCategory,
};