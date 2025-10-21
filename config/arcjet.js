// Import Arcjet and its specific security rule functions.
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";

// Initialize the Arcjet instance with the site key and security rules.
const aj = arcjet({
    key: ARCJET_KEY, // Your unique site key from the Arcjet dashboard.
    // Define the security rules to be applied to incoming requests.
    rules: [
        // The 'shield' rule provides baseline protection against common attacks.
        shield({ mode: "LIVE" }),
        // The 'detectBot' rule identifies and blocks malicious bots.
        detectBot({
            mode: "LIVE", // Use "LIVE" to block requests or "DRY_RUN" to only log them.
            // Allow legitimate bots, such as search engines.
            allow: [
                "CATEGORY:SEARCH_ENGINE",
            ],
        }),
        // The 'tokenBucket' rule implements a flexible rate-limiting algorithm.
        tokenBucket({
            mode: "LIVE", // Enforce the rate limit.
            refillRate: 5, // Add 5 tokens to the bucket per interval.
            interval: 10,  // The interval is 10 seconds.
            capacity: 10,  // The bucket has a maximum capacity of 10 tokens.
        }),
    ],
});

// Export the configured Arcjet instance.
export default aj;