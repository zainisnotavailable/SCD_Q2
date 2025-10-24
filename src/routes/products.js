const express = require('express');
const router = express.Router();

// Mock database
let products = [
    { id: 1, name: 'Laptop', price: 999.99, stock: 10, minStock: 5 },
    { id: 2, name: 'Mouse', price: 29.99, stock: 3, minStock: 10 },
    { id: 3, name: 'Keyboard', price: 79.99, stock: 15, minStock: 8 }
];

// GET /api/products - Get all products
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: products
    });
});

// GET /api/products/:id - Get product by ID
router.get('/:id', (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid product ID'
            });
        }

        const product = products.find(p => p.id === productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch product'
        });
    }
});

// POST /api/products - Create new product
router.post('/', (req, res) => {
    try {
        const { name, price, stock, minStock } = req.body;

        // Validation
        if (!name || !price || !stock) {
            return res.status(400).json({
                success: false,
                error: 'Name, price, and stock are required'
            });
        }

        if (price < 0 || stock < 0) {
            return res.status(400).json({
                success: false,
                error: 'Price and stock cannot be negative'
            });
        }

        const newProduct = {
            id: products.length + 1,
            name,
            price: parseFloat(price),
            stock: parseInt(stock),
            minStock: minStock || 5
        };

        products.push(newProduct);

        res.status(201).json({
            success: true,
            data: newProduct,
            message: 'Product created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create product'
        });
    }
});

// GET /api/products/low-stock - Get low stock products
router.get('/low-stock', (req, res) => {
    try {
        const lowStockProducts = products.filter(product => product.stock < product.minStock);
        
        res.status(200).json({
            success: true,
            data: lowStockProducts,
            count: lowStockProducts.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch low stock products'
        });
    }
});

module.exports = router;