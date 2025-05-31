const express = require("express");
const router = express.Router();
const verifyUser = require("../middlewares/auth");
const { shortenUrl, originalUrl, deleteUrl, getMyUrls } = require("../controllers/url-controllers");



// Shorten URL
router.post("/shorten", verifyUser, shortenUrl);

// Redirect to Long URL
router.post("/original", verifyUser, originalUrl);

// Get all URLs
router.get("/me", verifyUser, getMyUrls);

// Delete URL
router.post("/delete", verifyUser, deleteUrl);

module.exports = router;