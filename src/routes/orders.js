const express = require('express');
const router = express.Router();

// Mock databases
let orders = [];
const products = [
    { id: 1, name: 'Laptop', price: 999.99, stock: 10 },
    { id: 2, name: 'Mouse', price: 29.99, stock: 3 },
    { id: 3, name: 'Keyboard', price: 79.99, stock: 15 }
];

// POST /api/orders - Create new order
router.post('/', (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Validation
        if (!userId || !productId || !quantity) {
            return res.status(400).json({
                success: false,
                error: 'UserId, productId, and quantity are required'
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Quantity must be positive'
            });
        }

        const product = products.find(p => p.id === productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient stock'
            });
        }

        // Update stock
        product.stock -= quantity;

        const newOrder = {
            id: orders.length + 1,
            userId: parseInt(userId),
            productId: parseInt(productId),
            quantity: parseInt(quantity),
            total: product.price * quantity,
            status: 'completed',
            createdAt: new Date().toISOString()
        };

        orders.push(newOrder);

        res.status(201).json({
            success: true,
            data: newOrder,
            message: 'Order created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create order'
        });
    }
});

// GET /api/orders/user/:userId - Get orders by user
router.get('/user/:userId', (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID'
            });
        }

        const userOrders = orders.filter(order => order.userId === userId);

        res.status(200).json({
            success: true,
            data: userOrders,
            count: userOrders.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user orders'
        });
    }
});

module.exports = router;