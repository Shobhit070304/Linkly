const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  customShort: { type: String, required: false },
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  clicks: { type: Number, default: 0 },
  maxClicks: { type: Number },
  expiresAt: { type: Date },
  qrCode: { type: String },
  title: String,
  description: String,
  favicon: String,
  createdAt: { type: Date, default: Date.now },
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
