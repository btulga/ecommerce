const express = require('express');
const router = express.Router();
const ProductVariantService = require('../services/product-variant.service');

// Get all product variants
router.get('/', async (req, res) => {
  try {
    const variants = await ProductVariantService.findAll();
    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get variants for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const variants = await ProductVariantService.findByProductId(req.params.productId);
    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single product variant by ID
router.get('/:id', async (req, res) => {
  try {
    const variant = await ProductVariantService.findById(req.params.id);
    if (variant == null) {
      return res.status(404).json({ message: 'Product variant not found' });
    }
    res.json(variant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new product variant
router.post('/', async (req, res) => {
  try {
    const newVariant = await ProductVariantService.create(req.body);
    res.status(201).json(newVariant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product variant
router.put('/:id', async (req, res) => {
  try {
    const updatedVariant = await ProductVariantService.update(req.params.id, req.body);
    res.json(updatedVariant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product variant
router.delete('/:id', async (req, res) => {
  try {
    await ProductVariantService.delete(req.params.id);
    res.json({ message: 'Product variant deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;