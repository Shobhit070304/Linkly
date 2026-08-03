const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email when link click limit is reached
 */
async function sendMaxClicksEmail(toEmail, userName, shortUrl, longUrl, maxClicks) {
  try {
    if (!toEmail) return;
    const fullShortUrl = shortUrl.startsWith("http")
      ? shortUrl
      : `${process.env.BACKEND_URL || "http://localhost:8000/"}${shortUrl}`;

    await resend.emails.send({
      from: "Linkly <onboarding@resend.dev>",
      to: toEmail,
      subject: `Click limit reached for ${shortUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1f2937; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">Linkly 🔗</h1>
            <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Smart URL Shortener</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <h2 style="color: #111827; font-size: 18px;">Click Limit Reached!</h2>
          <p>Hi ${userName || "there"},</p>
          <p>Your short link <strong>${shortUrl}</strong> has reached its maximum click limit of <strong>${maxClicks} clicks</strong>.</p>
          
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #f3f4f6;">
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Short URL:</strong> <a href="${fullShortUrl}" style="color: #4f46e5;">${fullShortUrl}</a></p>
            <p style="margin: 0; font-size: 14px; word-break: break-all;"><strong>Destination:</strong> ${longUrl}</p>
          </div>

          <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">
            Future visitors attempting to access this link will now see a limit-reached page. You can manage or update your link settings in your Linkly Dashboard.
          </p>

          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard" style="background-color: #4f46e5; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Go to Dashboard</a>
          </div>
        </div>
      `,
    });
    console.log(`[Email] ✅ Max clicks email sent to ${toEmail} for ${shortUrl}`);
  } catch (err) {
    console.error(`[Email] ❌ Failed to send max clicks email:`, err.message);
  }
}

/**
 * Send email when link expiration date is reached
 */
async function sendExpirationEmail(toEmail, userName, shortUrl, longUrl, expiresAt) {
  try {
    if (!toEmail) return;
    const fullShortUrl = shortUrl.startsWith("http")
      ? shortUrl
      : `${process.env.BACKEND_URL || "http://localhost:8000/"}${shortUrl}`;

    const formattedDate = expiresAt
      ? new Date(expiresAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Today";

    await resend.emails.send({
      from: "Linkly <onboarding@resend.dev>",
      to: toEmail,
      subject: `Link expired: ${shortUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1f2937; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">Linkly 🔗</h1>
            <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Smart URL Shortener</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <h2 style="color: #111827; font-size: 18px;">Link Expired!</h2>
          <p>Hi ${userName || "there"},</p>
          <p>Your short link <strong>${shortUrl}</strong> has expired as of <strong>${formattedDate}</strong>.</p>
          
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #f3f4f6;">
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Short URL:</strong> <a href="${fullShortUrl}" style="color: #4f46e5;">${fullShortUrl}</a></p>
            <p style="margin: 0; font-size: 14px; word-break: break-all;"><strong>Destination:</strong> ${longUrl}</p>
          </div>

          <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">
            This link is no longer redirecting traffic. You can extend the expiration date or update its settings in your Linkly Dashboard.
          </p>

          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard" style="background-color: #4f46e5; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Go to Dashboard</a>
          </div>
        </div>
      `,
    });
    console.log(`[Email] ✅ Expiration email sent to ${toEmail} for ${shortUrl}`);
  } catch (err) {
    console.error(`[Email] ❌ Failed to send expiration email:`, err.message);
  }
}

module.exports = { sendMaxClicksEmail, sendExpirationEmail };