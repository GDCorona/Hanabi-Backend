import Visit from "../models/Visit.js";
import Click from "../models/Click.js";

const VISIT_ID = "global-counter";
export const getVisits = async (req, res) => {
  let v = await Visit.findById(VISIT_ID);
  if (!v) v = await Visit.create({ _id: VISIT_ID, count: 0 });
  res.json({ visits: v.count });
};

export const incrementVisits = async (req, res) => {
  try {
    // Grab the real IP from the proxy headers, fallback to standard IP
    let userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // Proxies sometimes send a list of IPs (e.g., "clientIP, proxy1, proxy2"), always get the first one in the list
    if (userIp && userIp.includes(',')) {
      userIp = userIp.split(',')[0].trim();
    }
    const existingClick = await Click.findOne({ ipAddress: userIp }); // Check if IP is already in database
    if (existingClick) {
      const v = await Visit.findById(VISIT_ID);
      return res.status(403).json({ 
        error: "You have already clicked!", 
        visits: v ? v.count : 0 
      });
    }
    await Click.create({ ipAddress: userIp });  // If new IP, add to database
    // Increment visit
    const v = await Visit.findByIdAndUpdate(VISIT_ID, { $inc: { count: 1 } }, { upsert: true, new: true });
    res.json({ visits: v.count });
  } catch (error) {
    console.error("Error saving visit:", error);
    res.status(500).json({ error: "Server error" });
  }
};