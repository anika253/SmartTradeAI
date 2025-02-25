import { createAgent, executeTask } from "@goat-sdk/goat";

const agent = createAgent({
    name: "DeFi AI Bot",
    plugins: ["trading", "risk-management"],
});

export const executeTrade = async (marketData) => {
    const decision = await executeTask(agent, "analyzeMarket", marketData);
    
    if (decision.action === "BUY") {
        console.log("AI suggests buying assets...");
        return "BUY";
    } else {
        console.log("AI suggests selling assets...");
        return "SELL";
    }
};
