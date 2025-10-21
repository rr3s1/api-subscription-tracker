// Import the configured Arcjet instance.
import aj from '../config/arcjet.js';

// --- ARCJET SECURITY MIDDLEWARE ---
const arcjetMiddleware = async (req, res, next) => {
    try {
        // Ask Arcjet to analyze the request and make a decision.
        // 'requested: 1' indicates that this request consumes one token from the rate limit bucket.
        const decision = await aj.protect(req, { requested: 1 });

        // If the decision is to deny the request, handle it accordingly.
        if (decision.isDenied()) {
            // Check if the denial is due to rate limiting.
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ error: 'Rate limit exceeded' }); // 429 Too Many Requests.
            }
            // Check if the denial is due to bot detection.
            if (decision.reason.isBot()) {
                return res.status(403).json({ error: 'Bot detected' }); // 403 Forbidden.
            }
            // For any other reason, return a generic forbidden error.
            return res.status(403).json({ error: 'Access denied' });
        }

        // If the request is allowed, proceed to the next middleware or route handler.
        next();
    } catch (error) {
        // Log any errors that occur within the middleware itself.
        console.log(`Arcjet Middleware Error: ${error}`);
        // Pass the error to the global error handler.
        next(error);
    }
};

export default arcjetMiddleware;