const Url = require("../models/url-model");
const Click = require("../models/click-model");
const User = require("../models/user-model");
const { sequelize } = require("../db/postgres");
const { QueryTypes } = require("sequelize");

// Helper: run GROUP BY aggregation for a single dimension column
const aggregateByColumn = async (column, urlIds) => {
  const rows = await sequelize.query(
    `SELECT COALESCE("${column}", 'Unknown') AS name, COUNT(*) AS value
     FROM clicks
     WHERE "urlId" IN (:urlIds)
     GROUP BY "${column}"
     ORDER BY value DESC
     LIMIT 20`,
    { replacements: { urlIds }, type: QueryTypes.SELECT }
  );
  return rows.map((r) => ({ name: r.name, value: Number(r.value) }));
};

// Helper: run timeline aggregation (clicks per day)
const aggregateTimeline = async (urlIds) => {
  const rows = await sequelize.query(
    `SELECT DATE_TRUNC('day', "clickedAt") AS date, COUNT(*) AS clicks
     FROM clicks
     WHERE "urlId" IN (:urlIds)
     GROUP BY DATE_TRUNC('day', "clickedAt")
     ORDER BY date ASC`,
    { replacements: { urlIds }, type: QueryTypes.SELECT }
  );
  return rows.map((r) => ({
    date: new Date(r.date).toISOString().split("T")[0],
    clicks: Number(r.clicks),
  }));
};

module.exports.getAnalytics = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    // 1. Authenticate and authorize
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    const url = await Url.findOne({ where: { shortUrl, userId: user.id } });
    if (!url) {
      return res.status(404).json({ status: false, error: "URL not found or unauthorized" });
    }

    const urlIds = [url.id];

    // 2. Run all aggregations in parallel via SQL (no in-memory row loading)
    const [countries, devices, browsers, os, timeline] = await Promise.all([
      aggregateByColumn("country", urlIds),
      aggregateByColumn("device", urlIds),
      aggregateByColumn("browser", urlIds),
      aggregateByColumn("os", urlIds),
      aggregateTimeline(urlIds),
    ]);

    return res.status(200).json({
      status: true,
      data: {
        totalClicks: url.clicks,
        countries,
        devices,
        browsers,
        os,
        timeline,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};

module.exports.getGlobalAnalytics = async (req, res) => {
  try {
    // 1. Authenticate and authorize
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    const urls = await Url.findAll({ where: { userId: user.id } });
    if (!urls || urls.length === 0) {
      return res.status(200).json({
        status: true,
        data: {
          totalClicks: 0,
          countries: [],
          devices: [],
          browsers: [],
          os: [],
          timeline: [],
        },
      });
    }

    const totalClicks = urls.reduce((acc, curr) => acc + curr.clicks, 0);
    const urlIds = urls.map((url) => url.id);

    // 2. Run all aggregations in parallel via SQL (no in-memory row loading)
    const [countries, devices, browsers, os, timeline] = await Promise.all([
      aggregateByColumn("country", urlIds),
      aggregateByColumn("device", urlIds),
      aggregateByColumn("browser", urlIds),
      aggregateByColumn("os", urlIds),
      aggregateTimeline(urlIds),
    ]);

    return res.status(200).json({
      status: true,
      data: {
        totalClicks,
        countries,
        devices,
        browsers,
        os,
        timeline,
      },
    });
  } catch (error) {
    console.error("Error fetching global analytics:", error);
    return res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};
