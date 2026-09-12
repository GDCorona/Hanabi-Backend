import { Request, Response } from "express";

export interface AredlInterface {
    name: string;
    position: number;
    nlw_tier: string;
};

export const getDemons = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://api.aredl.net/v2/api/aredl/levels");
        const aredlData = await response.json() as AredlInterface[];
        const { name } = req.query;

        if (name) {
            if (typeof name !== "string") {
                return res.status(400).json({ error: "Invalid name parameter" });
            }
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