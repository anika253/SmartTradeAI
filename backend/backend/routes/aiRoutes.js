import express from "express";
import { executeTradeWithAI } from "../services/goatService.js";

const router = express.Router();

router.post("/ai-trade", async (req, res) => {
    try {
        const { marketData } = req.body;
        const decision = await executeTradeWithAI(marketData);
        res.json(decision);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
