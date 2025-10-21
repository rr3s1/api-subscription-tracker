// Import the Router from Express and the user controller functions.
import { Router } from 'express';
import { getUser, getUsers } from '../controllers/user.controller.js';

// Create a new router instance for user-related routes.
const userRouter = Router();

// --- USER ROUTES ---
// Map the GET request for all users to the getUsers controller.
userRouter.get('/', getUsers);

// Map the GET request for a single user to the getUser controller.
userRouter.get('/:id', getUser);

// Placeholder routes for other CRUD operations.
userRouter.post('/', (req, res) => res.send({ title: 'CREATE new user' }));
userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE user' }));
userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE user' }));

// Export the user router.
export default userRouter;