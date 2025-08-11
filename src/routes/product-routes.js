const express = require('express');
const router = express.Router();

// Route to get all products
router.get('/', (req, res) => {
  // ProductController.getAllProducts(req, res);
});

// Route to get a single product by ID
router.get('/:id', (req, res) => {
  // ProductController.getProductById(req, res);
});

// Route to create a new product
router.post('/', (req, res) => {
  // ProductController.createProduct(req, res);
});

// Route to update a product by ID
router.put('/:id', (req, res) => {
  // ProductController.updateProduct(req, res);
});

// Route to delete a product by ID
router.delete('/:id', (req, res) => {
  // ProductController.deleteProduct(req, res);
});

module.exports = router;