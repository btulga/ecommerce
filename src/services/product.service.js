const {
  Product,
  ProductCategory,
  ProductVariant,
  Inventory,
  CustomerDiscountUsage,
  Location
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
    if (product) {
      const variants = await product.getVariants({
        include: [{
          model: Inventory,
          as: 'inventory',
          include: [{
            model: Location,
            as: 'location'
          }]
        }]
      });
      product.dataValues.variants = variants;
    }    return product;
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
      include: [{
        model: ProductVariant,
        as: 'variants',
        include: [{
          model: Inventory,
          as: 'inventory',
          include: [{
            model: Location,
            as: 'location'
          }]
        }]
      }]
    });
    return products;    
  } catch (error) {
    throw new Error('Error fetching products: ' + error.message);
  }
}

/**
 * Calculate the discounted price for a product based on customer and quantity.
 * @param {Product} product - The product instance.
 * @param {Customer} customer - The customer instance.
 * @param {number} quantity - The quantity being purchased.
 * @returns {Promise<number>} The calculated price after applying applicable discounts.
 */
async function calculateDiscountedPrice(product, customer, quantity) {
  let finalPrice = product.price; // Start with the base price
  let remainingQuantity = quantity;

  // Check if the customer has previously received a discount for this product
  const discountUsage = await CustomerDiscountUsage.findOne({
    where: {
      customer_id: customer.id,
      product_id: product.id,
    },
  });

  const hasPreviouslyDiscounted = discountUsage && discountUsage.times_used > 0;

  // If the customer hasn't previously received a discount and there are active discounts
  if (!hasPreviouslyDiscounted && product.discount_rule_id) { // Assuming discount_rule_id indicates an active discount
    // Apply discount to the first item
    const discountAmount = product.price * (product.discount_rule.discount_percentage / 100); // Assuming discount_percentage
    finalPrice = (product.price - discountAmount) * 1; // Price for the first item
    remainingQuantity = quantity - 1;
  }

  // Add the price of remaining items at full price
  if (remainingQuantity > 0) {
    finalPrice += product.price * remainingQuantity;
  }

  return finalPrice;
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
  calculateDiscountedPrice,
};