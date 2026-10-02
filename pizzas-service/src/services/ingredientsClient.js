// services/ingredientsClient.js
// HTTP client for the ingredients microservice (may run on another node).
require('dotenv').config();

const BASE_URL = (process.env.INGREDIENTS_API_URL || 'http://localhost:3001/api/v1').replace(/\/+$/, '');
const TIMEOUT_MS = Number(process.env.INGREDIENTS_API_TIMEOUT_MS) || 3000;

class IngredientsServiceError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = 'IngredientsServiceError';
        this.status = 503; // Service Unavailable: upstream dependency failed
        this.cause = cause;
    }
}

async function request(path) {
    let res;
    try {
        res = await fetch(`${BASE_URL}${path}`, {
            headers: { Accept: 'application/json' },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
    } catch (err) {
        throw new IngredientsServiceError('Ingredients service unreachable', err);
    }
    return res;
}

/**
 * @returns {Promise<object|null>} the ingredient, or null if it does not exist
 */
exports.findById = async (id) => {
    const res = await request(`/ingredients/${encodeURIComponent(id)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new IngredientsServiceError(`Ingredients service responded ${res.status}`);
    return res.json();
};

exports.IngredientsServiceError = IngredientsServiceError;
