// Import the Subscription model and the Upstash workflow client.
import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from '../config/env.js';

// --- CREATE SUBSCRIPTION CONTROLLER ---
export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        // --- TRIGGER WORKFLOW ---
        // After creating the subscription, trigger the reminder workflow.
        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            // Pass the new subscription's ID as the payload.
            body: {
                subscriptionId: subscription.id,
            },
        });

        res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (e) {
        next(e);
    }
};

// --- GET USER-SPECIFIC SUBSCRIPTIONS CONTROLLER ---
export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.statusCode = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
};