const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

router.get('/', (req, res) => {
    res.render('index/welcome');
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('index/dashboard');
});

// About
router.get('/about', (req, res) => {
    res.render('index/about');
});

module.exports = router;