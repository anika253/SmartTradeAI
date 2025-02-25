import express from "express";
import { getStablecoinYield, executeDeFiTrade } from "../services/brahmaFiService.js";

const router = express.Router();

router.get("/yield", async (req, res) => {
    try {
        const yieldData = await getStablecoinYield();
        res.json(yieldData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/trade", async (req, res) => {
    try {
        const { action, amount } = req.body;
        const result = await executeDeFiTrade(action, amount);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
