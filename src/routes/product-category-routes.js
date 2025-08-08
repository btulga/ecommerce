const express = require('express');
const router = express.Router();
const ProductCategoryService = require('../services/product-category.service');

// Get all product categories
router.get('/', async (req, res) => {
  try {
    const categories = await ProductCategoryService.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single product category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await ProductCategoryService.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Product category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new product category
router.post('/', async (req, res) => {
  try {
    const newCategory = await ProductCategoryService.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a product category by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await ProductCategoryService.update(req.params.id, req.body);
    if (updatedCategory) {
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Product category not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a product category by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ProductCategoryService.delete(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Product category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;