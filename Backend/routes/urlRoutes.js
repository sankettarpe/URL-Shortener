const express = require('express')
const  router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { createShortUrl, getUserUrls, redirectToOriginalUrl, deleteUrl } = require('../controller/urlController');

router.post('/shorten', protect, createShortUrl);
router.get('/myurls', protect, getUserUrls);
router.delete('/:linkId', protect, deleteUrl);
router.get('/:shortUrl', redirectToOriginalUrl);

module.exports = router;
