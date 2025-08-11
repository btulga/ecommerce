const {
  createProduct,
  findProductById,
  findAllProducts,
  updateProduct,
  deleteProduct
} = require('../../src/services/product.service');
const {
  Product
} = require('../../src/models');

jest.mock('../../src/models', () => ({
  Product: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('Product Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a new product successfully', async () => {
      const mockProductData = {
        name: 'Test Product',
        price: 100
      };
      const mockCreatedProduct = { ...mockProductData,
        id: 'prod_123'
      };
      Product.create.mockResolvedValue(mockCreatedProduct);

      const result = await createProduct(mockProductData);

      expect(Product.create).toHaveBeenCalledWith(mockProductData);
      expect(result).toEqual(mockCreatedProduct);
    });

    it('should throw an error if product creation fails', async () => {
      const mockProductData = {
        name: 'Test Product',
        price: 100
      };
      const mockError = new Error('Database error');
      Product.create.mockRejectedValue(mockError);

      await expect(createProduct(mockProductData)).rejects.toThrow(
        'Error creating product: Database error'
      );
      expect(Product.create).toHaveBeenCalledWith(mockProductData);
    });
  });

  describe('findProductById', () => {
    it('should find a product by ID', async () => {
      const productId = 'prod_123';
      const mockProduct = {
        id: productId,
        name: 'Test Product',
        price: 100
      };
      Product.findByPk.mockResolvedValue(mockProduct);

      const result = await findProductById(productId);

      expect(Product.findByPk).toHaveBeenCalledWith(productId, {});
      expect(result).toEqual(mockProduct);
    });

    it('should return null if product is not found', async () => {
      const productId = 'prod_123';
      Product.findByPk.mockResolvedValue(null);

      const result = await findProductById(productId);

      expect(Product.findByPk).toHaveBeenCalledWith(productId, {});
      expect(result).toBeNull();
    });

    it('should throw an error if finding product fails', async () => {
      const productId = 'prod_123';
      const mockError = new Error('Database error');
      Product.findByPk.mockRejectedValue(mockError);

      await expect(findProductById(productId)).rejects.toThrow(
        'Error finding product: Database error'
      );
      expect(Product.findByPk).toHaveBeenCalledWith(productId, {});
    });
  });

  describe('findAllProducts', () => {
    it('should find all products', async () => {
      const mockProducts = [{
        id: 'prod_1',
        name: 'Product 1'
      }, {
        id: 'prod_2',
        name: 'Product 2'
      }, ];
      Product.findAll.mockResolvedValue(mockProducts);

      const result = await findAllProducts();

      expect(Product.findAll).toHaveBeenCalledWith({
        where: {}
      });
      expect(result).toEqual(mockProducts);
    });

    it('should find products filtered by category ID', async () => {
      const categoryId = 'cat_123';
      const mockProducts = [{
        id: 'prod_1',
        name: 'Product 1',
        category_id: categoryId
      }, ];
      Product.findAll.mockResolvedValue(mockProducts);

      const result = await findAllProducts({
        category_id: categoryId
      });

      expect(Product.findAll).toHaveBeenCalledWith({
        where: {
          category_id: categoryId
        }
      });
      expect(result).toEqual(mockProducts);
    });

    it('should return an empty array if no products are found', async () => {
      Product.findAll.mockResolvedValue([]);

      const result = await findAllProducts();

      expect(Product.findAll).toHaveBeenCalledWith({
        where: {}
      });
      expect(result).toEqual([]);
    });

    it('should throw an error if fetching products fails', async () => {
      const mockError = new Error('Database error');
      Product.findAll.mockRejectedValue(mockError);

      await expect(findAllProducts()).rejects.toThrow(
        'Error fetching products: Database error'
      );
      expect(Product.findAll).toHaveBeenCalledWith({
        where: {}
      });
    });
  });

  describe('updateProduct', () => {
    it('should update a product by ID', async () => {
      const productId = 'prod_123';
      const updateData = {
        price: 150
      };
      const mockUpdatedProduct = [{
        id: productId,
        name: 'Test Product',
        price: 150
      }];
      Product.update.mockResolvedValue([1, mockUpdatedProduct]);

      const result = await updateProduct(productId, updateData);

      expect(Product.update).toHaveBeenCalledWith(updateData, {
        where: {
          id: productId
        },
        returning: true,
      });
      expect(result).toEqual([1, mockUpdatedProduct]);
    });

    it('should return [0, []] if product is not found for update', async () => {
      const productId = 'prod_123';
      const updateData = {
        price: 150
      };
      Product.update.mockResolvedValue([0, []]);

      const result = await updateProduct(productId, updateData);

      expect(Product.update).toHaveBeenCalledWith(updateData, {
        where: {
          id: productId
        },
        returning: true,
      });
      expect(result).toEqual([0, []]);
    });

    it('should throw an error if updating product fails', async () => {
      const productId = 'prod_123';
      const updateData = {
        price: 150
      };
      const mockError = new Error('Database error');
      Product.update.mockRejectedValue(mockError);

      await expect(updateProduct(productId, updateData)).rejects.toThrow(
        'Error updating product: Database error'
      );
      expect(Product.update).toHaveBeenCalledWith(updateData, {
        where: {
          id: productId
        },
        returning: true,
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by ID', async () => {
      const productId = 'prod_123';
      Product.destroy.mockResolvedValue(1);

      const result = await deleteProduct(productId);

      expect(Product.destroy).toHaveBeenCalledWith({
        where: {
          id: productId
        }
      });
      expect(result).toBe(1);
    });

    it('should return 0 if product is not found for deletion', async () => {
      const productId = 'prod_123';
      Product.destroy.mockResolvedValue(0);

      const result = await deleteProduct(productId);

      expect(Product.destroy).toHaveBeenCalledWith({
        where: {
          id: productId
        }
      });
      expect(result).toBe(0);
    });

    it('should throw an error if deleting product fails', async () => {
      const productId = 'prod_123';
      const mockError = new Error('Database error');
      Product.destroy.mockRejectedValue(mockError);

      await expect(deleteProduct(productId)).rejects.toThrow(
        'Error deleting product: Database error'
      );
      expect(Product.destroy).toHaveBeenCalledWith({
        where: {
          id: productId
        }
      });
    });
  });
});