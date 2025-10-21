// Import the Subscription model to interact with the database.
import Subscription from "../models/subscription.model.js";

// --- CREATE SUBSCRIPTION CONTROLLER ---
// An async function to handle the logic for creating a new subscription.
export const createSubscription = async (req, res, next) => {
    try {
        // Create a new subscription document in the database.
        const subscription = await Subscription.create({
            // Spread the request body to include all subscription details from the client.
            ...req.body,
            // Associate the subscription with the authenticated user.
            // req.user is populated by the 'authorize' middleware.
            user: req.user._id,
        });

        // --- SUCCESS RESPONSE ---
        // Send a 201 Created status with the new subscription data.
        res.status(201).json({ success: true, data: { subscription } });
    } catch (e) {
        // If an error occurs (e.g., validation failure), pass it to the global error handler.
        next(e);
    }
};