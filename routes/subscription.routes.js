// Import necessary modules for routing and controllers.
import { Router } from 'express';
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getUserSubscriptions } from "../controllers/subscription.controller.js";

// Create a new router instance for subscriptions.
const subscriptionRouter = Router();

// --- SUBSCRIPTION ROUTES ---
// Placeholders for other subscription-related endpoints.
subscriptionRouter.get('/', (req, res) => res.send({ title: 'GET all subscriptions' }));
subscriptionRouter.get('/:id', (req, res) => res.send({ title: 'GET subscription details' }));

// --- PROTECTED ROUTES ---
// Secure the subscription creation route.
subscriptionRouter.post('/', authorize, createSubscription);

// Secure the route for fetching user-specific subscriptions.
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

// Placeholder routes for other operations.
subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE subscription' }));
subscriptionRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE subscription' }));
subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: 'CANCEL subscription' }));
subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: 'GET upcoming renewals' }));

// Export the configured router.
export default subscriptionRouter;