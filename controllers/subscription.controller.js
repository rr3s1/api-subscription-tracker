// Import the Subscription model for database interaction.
import Subscription from "../models/subscription.model.js";

// --- CREATE SUBSCRIPTION CONTROLLER ---
export const createSubscription = async (req, res, next) => {
    try {
        // Create a new subscription, associating it with the authenticated user.
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        // Respond with a 201 Created status and the new subscription data.
        res.status(201).json({ success: true, data: { subscription } });
    } catch (e) {
        next(e);
    }
};

// --- GET USER-SPECIFIC SUBSCRIPTIONS CONTROLLER ---
export const getUserSubscriptions = async (req, res, next) => {
    try {
        // --- OWNERSHIP VERIFICATION ---
        // Ensure the authenticated user is only accessing their own subscriptions.
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.statusCode = 401; // Unauthorized.
            throw error;
        }

        // --- DATABASE QUERY ---
        // Find all subscriptions that belong to the specified user ID.
        const subscriptions = await Subscription.find({ user: req.params.id });

        // --- SUCCESS RESPONSE ---
        // Respond with a 200 OK status and the user's subscriptions.
        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        // Pass any errors to the global error handler.
        next(e);
    }
};