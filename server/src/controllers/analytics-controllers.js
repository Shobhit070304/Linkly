const Url = require("../models/url-model");
const Click = require("../models/click-model");
const User = require("../models/user-model");
const { sequelize } = require("../db/postgres");

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

    // 2. Fetch basic counts
    const totalClicks = url.clicks;

    // 3. Aggregate Clicks Data
    const clicks = await Click.findAll({
      where: { urlId: url.id },
      raw: true,
    });

    // We can aggregate in memory or via SQL. Since data might not be huge, memory is fine, or SQL for better performance.
    // Let's use memory aggregation for simplicity across databases if we ever switch, but SQL is fine too.
    
    const stats = {
      countries: {},
      devices: {},
      browsers: {},
      os: {},
      timeline: {} // date string (YYYY-MM-DD) -> count
    };

    clicks.forEach(click => {
      const country = click.country || "Unknown";
      const device = click.device || "Unknown";
      const browser = click.browser || "Unknown";
      const os = click.os || "Unknown";
      
      const date = new Date(click.clickedAt).toISOString().split('T')[0];

      stats.countries[country] = (stats.countries[country] || 0) + 1;
      stats.devices[device] = (stats.devices[device] || 0) + 1;
      stats.browsers[browser] = (stats.browsers[browser] || 0) + 1;
      stats.os[os] = (stats.os[os] || 0) + 1;
      stats.timeline[date] = (stats.timeline[date] || 0) + 1;
    });

    // Format for charting libraries (arrays of {name, value})
    const formatData = (obj) => Object.entries(obj)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const timelineData = Object.entries(stats.timeline)
      .map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Chronological

    return res.status(200).json({
      status: true,
      data: {
        totalClicks,
        countries: formatData(stats.countries),
        devices: formatData(stats.devices),
        browsers: formatData(stats.browsers),
        os: formatData(stats.os),
        timeline: timelineData,
      }
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
        }
      });
    }

    // 2. Fetch basic counts
    const totalClicks = urls.reduce((acc, curr) => acc + curr.clicks, 0);
    const urlIds = urls.map(url => url.id);

    // 3. Aggregate Clicks Data
    const clicks = await Click.findAll({
      where: { urlId: urlIds },
      raw: true,
    });
    
    const stats = {
      countries: {},
      devices: {},
      browsers: {},
      os: {},
      timeline: {}
    };

    clicks.forEach(click => {
      const country = click.country || "Unknown";
      const device = click.device || "Unknown";
      const browser = click.browser || "Unknown";
      const os = click.os || "Unknown";
      
      const date = new Date(click.clickedAt).toISOString().split('T')[0];

      stats.countries[country] = (stats.countries[country] || 0) + 1;
      stats.devices[device] = (stats.devices[device] || 0) + 1;
      stats.browsers[browser] = (stats.browsers[browser] || 0) + 1;
      stats.os[os] = (stats.os[os] || 0) + 1;
      stats.timeline[date] = (stats.timeline[date] || 0) + 1;
    });

    // Format for charting libraries
    const formatData = (obj) => Object.entries(obj)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const timelineData = Object.entries(stats.timeline)
      .map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Chronological

    return res.status(200).json({
      status: true,
      data: {
        totalClicks,
        countries: formatData(stats.countries),
        devices: formatData(stats.devices),
        browsers: formatData(stats.browsers),
        os: formatData(stats.os),
        timeline: timelineData,
      }
    });

  } catch (error) {
    console.error("Error fetching global analytics:", error);
    return res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};
