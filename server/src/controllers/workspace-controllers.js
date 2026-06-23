const crypto = require("crypto");
const Workspace = require("../models/workspace-model");
const User = require("../models/user-model");

// Helper — generate a SHA-256 hash of the API key
const hashKey = (key) => crypto.createHash("sha256").update(key).digest("hex");

// POST /api/workspaces/create
module.exports.createWorkspace = async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ status: false, error: "Workspace name is required" });
  }

  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    // Generate a secure random API key — shown to the user only once
    const rawKey = "linkly_sk_" + crypto.randomBytes(24).toString("hex");
    const apiKeyHash = hashKey(rawKey);

    const workspace = await Workspace.create({
      name: name.trim(),
      userId: user.id,
      apiKeyHash,
    });

    // Return the plaintext key in this response ONLY. We never store or show it again.
    return res.status(201).json({
      status: true,
      message: "Workspace created successfully. Save your API key — it will not be shown again.",
      workspace: {
        id: workspace.id,
        name: workspace.name,
        createdAt: workspace.createdAt,
      },
      apiKey: rawKey,
    });
  } catch (error) {
    console.error("Create workspace error:", error);
    return res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};

// GET /api/workspaces
module.exports.getWorkspaces = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    const workspaces = await Workspace.findAll({
      where: { userId: user.id },
      attributes: ["id", "name", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ status: true, workspaces });
  } catch (error) {
    console.error("Get workspaces error:", error);
    return res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};

// DELETE /api/workspaces/:id
module.exports.deleteWorkspace = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    const workspace = await Workspace.findOne({ where: { id, userId: user.id } });
    if (!workspace) {
      return res.status(404).json({ status: false, error: "Workspace not found or not authorized" });
    }

    // onDelete: 'CASCADE' on Workspace.hasMany(Url) handles link deletion automatically
    await workspace.destroy();

    return res.status(200).json({ status: true, message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("Delete workspace error:", error);
    return res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};
