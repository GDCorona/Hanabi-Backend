import Visit from "../models/Visit.js";

const VISIT_ID = "global-counter";
export const getVisits = async (req, res) => {
  let v = await Visit.findById(VISIT_ID);
  if (!v) v = await Visit.create({ _id: VISIT_ID, count: 0 });
  res.json({ visits: v.count });
};

export const incrementVisits = async (req, res) => {
  const v = await Visit.findByIdAndUpdate(VISIT_ID, { $inc: { count: 1 } }, { upsert: true, new: true });
  res.json({ visits: v.count });
};