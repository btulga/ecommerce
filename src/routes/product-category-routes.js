const { Router } = require('express');
const {
  createProductCategory,
  getAllProductCategories,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
} = require('../controllers/product-category.controller');

const router = Router();

router.post('/', createProductCategory);
router.get('/', getAllProductCategories);
router.get('/:id', getProductCategoryById);
router.put('/:id', updateProductCategory);
router.delete('/:id', deleteProductCategory);

module.exports = router;