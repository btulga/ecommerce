const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  addProductToCategory,
  removeProductFromCategory,
} = require('../../src/services/category.service');
const Category = require('../../src/models/product/category.model');
const ProductCategory = require('../../src/models/product/product-category.model');

jest.mock('../../src/models/product/category.model');
jest.mock('../../src/models/product/product-category.model');

describe('Category Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const categoryData = {
        name: 'Electronics',
        description: 'Electronic items',
      };
      const mockCategory = { ...categoryData,
        save: jest.fn().mockResolvedValue(categoryData)
      };
      Category.mockImplementation(() => mockCategory);

      const result = await createCategory(categoryData);

      expect(Category).toHaveBeenCalledWith(categoryData);
      expect(mockCategory.save).toHaveBeenCalled();
      expect(result).toEqual(categoryData);
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = [{
        name: 'Electronics'
      }, {
        name: 'Books'
      }];
      Category.find.mockResolvedValue(mockCategories);

      const result = await getAllCategories();

      expect(Category.find).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by ID', async () => {
      const categoryId = 'some-id';
      const mockCategory = {
        id: categoryId,
        name: 'Electronics'
      };
      Category.findById.mockResolvedValue(mockCategory);

      const result = await getCategoryById(categoryId);

      expect(Category.findById).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual(mockCategory);
    });

    it('should throw an error if category is not found', async () => {
      const categoryId = 'non-existent-id';
      Category.findById.mockResolvedValue(null);

      await expect(getCategoryById(categoryId)).rejects.toThrow(
        'Category not found'
      );
      expect(Category.findById).toHaveBeenCalledWith(categoryId);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const categoryId = 'some-id';
      const updatedData = {
        name: 'Updated Electronics'
      };
      const mockUpdatedCategory = {
        id: categoryId,
        ...updatedData
      };
      Category.findByIdAndUpdate.mockResolvedValue(mockUpdatedCategory);

      const result = await updateCategory(categoryId, updatedData);

      expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
        categoryId,
        updatedData, {
          new: true
        }
      );
      expect(result).toEqual(mockUpdatedCategory);
    });

    it('should throw an error if category is not found', async () => {
      const categoryId = 'non-existent-id';
      const updatedData = {
        name: 'Updated Electronics'
      };
      Category.findByIdAndUpdate.mockResolvedValue(null);

      await expect(updateCategory(categoryId, updatedData)).rejects.toThrow(
        'Category not found'
      );
      expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
        categoryId,
        updatedData, {
          new: true
        }
      );
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const categoryId = 'some-id';
      const mockDeletedCategory = {
        id: categoryId,
        name: 'Electronics'
      };
      Category.findByIdAndDelete.mockResolvedValue(mockDeletedCategory);

      const result = await deleteCategory(categoryId);

      expect(Category.findByIdAndDelete).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual(mockDeletedCategory);
    });

    it('should throw an error if category is not found', async () => {
      const categoryId = 'non-existent-id';
      Category.findByIdAndDelete.mockResolvedValue(null);

      await expect(deleteCategory(categoryId)).rejects.toThrow(
        'Category not found'
      );
      expect(Category.findByIdAndDelete).toHaveBeenCalledWith(categoryId);
    });
  });

  describe('addProductToCategory', () => {
    it('should add a product to a category if it does not exist', async () => {
      const categoryId = 'category-id';
      const productId = 'product-id';
      const mockProductCategory = {
        category_id: categoryId,
        product_id: productId
      };
      ProductCategory.findOne.mockResolvedValue(null);
      ProductCategory.create.mockResolvedValue(mockProductCategory);

      const result = await addProductToCategory(categoryId, productId);

      expect(ProductCategory.findOne).toHaveBeenCalledWith({
        where: {
          category_id: categoryId,
          product_id: productId
        }
      });
      expect(ProductCategory.create).toHaveBeenCalledWith({
        category_id: categoryId,
        product_id: productId
      });
      expect(result).toEqual(mockProductCategory);
    });

    it('should return the existing record if it already exists', async () => {
      const categoryId = 'category-id';
      const productId = 'product-id';
      const mockProductCategory = {
        id: 'existing-id',
        category_id: categoryId,
        product_id: productId
      };
      ProductCategory.findOne.mockResolvedValue(mockProductCategory);
      ProductCategory.create.mockResolvedValue({}); // Should not be called

      const result = await addProductToCategory(categoryId, productId);

      expect(ProductCategory.findOne).toHaveBeenCalledWith({
        where: {
          category_id: categoryId,
          product_id: productId
        }
      });
      expect(ProductCategory.create).not.toHaveBeenCalled();
      expect(result).toEqual(mockProductCategory);
    });
  });

  describe('removeProductFromCategory', () => {
    it('should remove a product from a category', async () => {
      const categoryId = 'category-id';
      const productId = 'product-id';
      const deletedRowCount = 1;
      ProductCategory.destroy.mockResolvedValue(deletedRowCount);

      const result = await removeProductFromCategory(categoryId, productId);

      expect(ProductCategory.destroy).toHaveBeenCalledWith({
        where: {
          category_id: categoryId,
          product_id: productId
        },
      });
      expect(result).toBe(deletedRowCount);
    });
  });
});
