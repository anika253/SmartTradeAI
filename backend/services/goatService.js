import { createAgent, executeTask } from "@goat-sdk/goat";

const agent = createAgent({
    name: "DeFi AI Bot",
    plugins: ["trading", "risk-management"],
});

export const executeTradeWithAI = async (marketData) => {
    const decision = await executeTask(agent, "analyzeMarket", marketData);
    
    return decision.action;
};
