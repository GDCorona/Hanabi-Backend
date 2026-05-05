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
    const userIp = req.ip; 
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