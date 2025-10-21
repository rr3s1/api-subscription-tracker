// Import the Router, user controllers, and the authorization middleware.
import { Router } from 'express';
import { getUser, getUsers } from '../controllers/user.controller.js';
import authorize from '../middlewares/auth.middleware.js';

// Create a new router instance for user routes.
const userRouter = Router();

// --- USER ROUTES ---
// This route to get all users is currently public.
userRouter.get('/', getUsers);

// --- PROTECTED ROUTE ---
// The 'authorize' middleware is placed here to protect this specific endpoint.
// Only requests with a valid JWT will be able to access the 'getUser' controller.
userRouter.get('/:id', authorize, getUser);

// Placeholder routes for other user operations.
userRouter.post('/', (req, res) => res.send({ title: 'CREATE new user' }));
userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE user' }));
userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE user' }));

// Export the user router.
export default userRouter;