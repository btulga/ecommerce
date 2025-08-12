const { Router } = require('express');
const {
  createCategory,
  findAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');

const router = Router();

// Create a new category
router.post('/', createCategory);

// Get all categories
router.get('/', findAllCategories);

// Get a single category by ID
router.get('/:id', getCategoryById);

// Update a category by ID
router.put('/:id', updateCategory);

// Delete a category by ID
router.delete('/:id', deleteCategory);

module.exports = router;