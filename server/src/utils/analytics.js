const geoip = require("geoip-lite");
const UAParser = require("ua-parser-js");
const Click = require("../models/click-model");
const Url = require("../models/url-model");

const logClick = async (urlId, ipAddress, userAgent, referrer) => {
  try {

    // Parse Location from IP
    let country = null;
    let city = null;
    if (ipAddress) {
      const geo = geoip.lookup(ipAddress);
      if (geo) {
        country = geo.country;
        city = geo.city;
      }
    }

    // Parse Device from User-Agent
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    let deviceType = result.device.type || "Desktop";
    if (deviceType === "mobile") deviceType = "Mobile";
    if (deviceType === "tablet") deviceType = "Tablet";

    // 1. Create the click analytics record
    await Click.create({
      urlId,
      ipAddress,
      country,
      city,
      device: deviceType,
      browser: result.browser.name || "Unknown",
      os: result.os.name || "Unknown",
      referrer,
    });

    // 2. Asynchronously update the cumulative click counter in PostgreSQL
    await Url.increment("clicks", { by: 1, where: { id: urlId } });

    // 3. Check if maxClicks limit reached and send notification email
    const User = require("../models/user-model");
    const updatedUrl = await Url.findByPk(urlId, {
      include: [{ model: User, as: "user", attributes: ["email", "name"] }],
    });
    if (
      updatedUrl &&
      updatedUrl.maxClicks &&
      updatedUrl.clicks >= updatedUrl.maxClicks &&
      !updatedUrl.isEmailNotified
    ) {
      await updatedUrl.update({ isEmailNotified: true });
      const { sendMaxClicksEmail } = require("./resendEmail");
      await sendMaxClicksEmail(
        updatedUrl.user?.email,
        updatedUrl.user?.name,
        updatedUrl.shortUrl,
        updatedUrl.longUrl,
        updatedUrl.maxClicks
      );
    }
  } catch (error) {
    console.error("Error logging click analytics:", error);
  }
};

module.exports = { logClick };
