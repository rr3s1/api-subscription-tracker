// Import the User model to interact with the users collection.
import User from '../models/user.model.js';

// --- GET ALL USERS CONTROLLER ---
export const getUsers = async (req, res, next) => {
    try {
        // Fetch all documents from the User collection.
        const users = await User.find();

        // Send a successful response with the array of users.
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        // Pass any database errors to the global error handler.
        next(error);
    }
};

// --- GET SINGLE USER CONTROLLER ---
export const getUser = async (req, res, next) => {
    try {
        // Find a user by the ID provided in the URL parameters.
        // The .select('-password') method excludes the password field from the result.
        const user = await User.findById(req.params.id).select('-password');

        // --- VALIDATION ---
        // If no user is found, create and throw a 404 error.
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Send a successful response with the single user's data.
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        // Pass any errors to the global error handler.
        next(error);
    }
};