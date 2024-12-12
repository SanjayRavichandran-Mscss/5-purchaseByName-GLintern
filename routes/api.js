// by using subquery
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// User Registration Endpoint
router.post('/register-user', async (req, res, next) => {
    const { username, mob_num, city, state, country } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO user_details (username, mob_num, city, state, country) VALUES (?, ?, ?, ?, ?)',
            [username, mob_num, city, state, country]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        next(err);
    }
});

// Product Registration Endpoint
router.post('/register-product', async (req, res, next) => {
    const { product_name, product_quantity, product_price } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO product_details (product_name, product_quantity, product_price) VALUES (?, ?, ?)',
            [product_name, product_quantity, product_price]
        );
        res.status(201).json({ message: 'Product registered successfully', productId: result.insertId });
    } catch (err) {
        next(err);
    }
});

// Purchase Endpoint with Subqueries
router.post('/purchase', async (req, res, next) => {
    const { user_name, product_name, purchase_quantity } = req.body;

    try {
        // Validate user existence
        const [[user]] = await db.query('SELECT id, username FROM user_details WHERE username = ?', [user_name]);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate product existence and quantity
        const [[product]] = await db.query('SELECT id, product_name, product_quantity FROM product_details WHERE product_name = ?', [product_name]);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.product_quantity < purchase_quantity) {
            return res.status(400).json({ message: 'Insufficient product quantity' });
        }

        // Perform purchase with subqueries
        await db.query(
            `INSERT INTO purchase_details (user_id, product_id, user_name, product_name, purchase_quantity) 
             SELECT u.id, p.id, u.username, p.product_name, ? 
             FROM user_details u, product_details p 
             WHERE u.username = ? AND p.product_name = ?`,
            [purchase_quantity, user_name, product_name]
        );

        // Update product quantity with a subquery
        await db.query(
            `UPDATE product_details 
             SET product_quantity = product_quantity - ? 
             WHERE product_name = ?`,
            [purchase_quantity, product_name]
        );

        res.status(201).json({ message: 'Purchase recorded successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
