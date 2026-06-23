const express = require("express");
const router = express.Router();
const verifyUser = require("../middlewares/auth");
const {
  createWorkspace,
  getWorkspaces,
  deleteWorkspace,
} = require("../controllers/workspace-controllers");

// Create a new workspace (generates an API key)
router.post("/create", verifyUser, createWorkspace);

// Get all workspaces for the logged-in user
router.get("/", verifyUser, getWorkspaces);

// Delete a workspace (and cascade-delete all its links)
router.delete("/:id", verifyUser, deleteWorkspace);

module.exports = router;
