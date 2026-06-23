const express = require("express");
const router = express.Router();
const verifyUser = require("../middlewares/auth");
const { shortenUrl, originalUrl, deleteUrl, getMyUrls, checkUrlHealthManual } = require("../controllers/url-controllers");
const { getAnalytics, getGlobalAnalytics } = require("../controllers/analytics-controllers");



// Shorten URL
router.post("/shorten", verifyUser, shortenUrl);

// Redirect to Long URL
router.get("/original/:shortCode", verifyUser, originalUrl);

// Get all URLs
router.get("/me", verifyUser, getMyUrls);

// Delete URL
router.delete("/:shortUrl", verifyUser, deleteUrl);

// Manual health check (Re-verify button) — resets failure count if site is back online
router.post("/:shortUrl/check-health", verifyUser, checkUrlHealthManual);

// Get Global Analytics
router.get("/analytics/me", verifyUser, getGlobalAnalytics);

// Get Analytics for single URL
router.get("/analytics/:shortUrl", verifyUser, getAnalytics);

module.exports = router;