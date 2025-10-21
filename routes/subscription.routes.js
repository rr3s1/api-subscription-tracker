// Import the Router, authorization middleware, and subscription controller.
import { Router } from 'express';
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription } from "../controllers/subscription.controller.js";

// Create a new router instance for subscription-related endpoints.
const subscriptionRouter = Router();

// --- SUBSCRIPTION ROUTES ---

// Placeholder route for getting all subscriptions.
subscriptionRouter.get('/', (req, res) => res.send({ title: 'GET all subscriptions' }));

// Placeholder route for getting a single subscription by ID.
subscriptionRouter.get('/:id', (req, res) => res.send({ title: 'GET subscription details' }));

// --- PROTECTED ROUTE FOR CREATION ---
// The 'authorize' middleware is used here to ensure only authenticated users can create subscriptions.
// It runs before the 'createSubscription' controller.
subscriptionRouter.post('/', authorize, createSubscription);

// Placeholder routes for other CRUD and custom operations.
subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE subscription' }));
subscriptionRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE subscription' }));
subscriptionRouter.get('/user/:id', (req, res) => res.send({ title: 'GET ALL user subscriptions' }));
subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: 'CANCEL subscription' }));
subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: 'GET upcoming renewals' }));

// Export the configured subscription router.
export default subscriptionRouter;