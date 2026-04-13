export const getDemons = async (req, res) => {
  try {
    const response = await fetch("https://api.aredl.net/v2/api/aredl/levels");
    const aredlData = await response.json();
    const { name } = req.query;

    if (name) {
      const demon = aredlData.find(l => l.name.toLowerCase() === name.toLowerCase());
      if (!demon) return res.status(404).json({ error: "Demon not found" });
      return res.json({ name: demon.name, aredlRank: demon.position, difficulty: demon.nlw_tier });
    }

    const demons = aredlData.map(l => ({ name: l.name, aredlRank: l.position, difficulty: l.nlw_tier }));
    res.json(demons);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch AREDL data" });
  }
};