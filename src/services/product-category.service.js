const ProductCategory = require('../models/product-category.model');

class ProductCategoryService {
  async createProductCategory(productId, categoryId) {
    try {
      const productCategory = await ProductCategory.create({ productId, categoryId });
      return productCategory;
    } catch (error) {
      throw new Error('Error creating product category link: ' + error.message);
    }
  }

  async getProductCategoryById(id) {
    try {
      const productCategory = await ProductCategory.findByPk(id);
      if (!productCategory) {
        throw new Error('Product category link not found');
      }
      return productCategory;
    } catch (error) {
      throw new Error('Error getting product category link by id: ' + error.message);
    }
  }

  async getAllProductCategories() {
    try {
      const productCategories = await ProductCategory.findAll();
      return productCategories;
    } catch (error) {
      throw new Error('Error getting all product category links: ' + error.message);
    }
  }

  async getProductCategoriesByProductId(productId) {
    try {
      const productCategories = await ProductCategory.findAll({ where: { productId } });
      return productCategories;
    } catch (error) {
      throw new Error('Error getting product category links by product id: ' + error.message);
    }
  }

  async getProductCategoriesByCategoryId(categoryId) {
    try {
      const productCategories = await ProductCategory.findAll({ where: { categoryId } });
      return productCategories;
    } catch (error) {
      throw new Error('Error getting product category links by category id: ' + error.message);
    }
  }

  async deleteProductCategory(id) {
    try {
      const deleted = await ProductCategory.destroy({ where: { id } });
      if (deleted === 0) {
        throw new Error('Product category link not found');
      }
      return { message: 'Product category link deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting product category link: ' + error.message);
    }
  }

  async deleteProductCategoryByProductAndCategory(productId, categoryId) {
    try {
      const deleted = await ProductCategory.destroy({ where: { productId, categoryId } });
      if (deleted === 0) {
        throw new Error('Product category link not found for the given product and category');
      }
      return { message: 'Product category link deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting product category link by product and category: ' + error.message);
    }
  }
}

module.exports = new ProductCategoryService();