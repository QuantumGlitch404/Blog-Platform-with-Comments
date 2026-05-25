const express = require('express');
const { search } = require('../controllers/searchController');
const ENDPOINTS = require('../constants/apiEndpoints');

const router = express.Router();

router.get(ENDPOINTS.SEARCH.BASE, search);

module.exports = router;
