import axios from 'axios';

const BRAHMAFI_API = "https://api.brahma.fi";

export const getStablecoinYield = async () => {
    try {
        const response = await axios.get(`${BRAHMAFI_API}/yield/stablecoin`);
        return response.data;
    } catch (error) {
        console.error("Error fetching BrahmaFi yield:", error);
        throw error;
    }
};
