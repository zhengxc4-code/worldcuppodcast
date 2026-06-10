const fs = require("fs");
const path = require("path");

module.exports = function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "data", "site-data.json");
    const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({
      error: "site-data unavailable",
      detail: error.message
    });
  }
};
