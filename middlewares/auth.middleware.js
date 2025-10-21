// Import modules for JWT verification and user database queries.
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

// --- AUTHORIZATION MIDDLEWARE ---
const authorize = async (req, res, next) => {
    try {
        let token;

        // --- TOKEN EXTRACTION ---
        // Check for the token in the 'Authorization' header with the 'Bearer' scheme.
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Extract the token string by removing the 'Bearer ' prefix.
            token = req.headers.authorization.split(' ')[1];
        }

        // If no token is found, return an unauthorized error.
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // --- TOKEN VERIFICATION ---
        // Verify the token's signature and decode its payload.
        const decoded = jwt.verify(token, JWT_SECRET);

        // --- USER VALIDATION ---
        // Find the user in the database using the ID from the token's payload.
        const user = await User.findById(decoded.userId);

        // If the user associated with the token no longer exists, return an error.
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // --- ATTACH USER TO REQUEST ---
        // Attach the authenticated user object to the request for use in subsequent handlers.
        req.user = user;

        // Proceed to the next middleware or the main route handler.
        next();
    } catch (error) {
        // If token verification fails or any other error occurs, return a 401 status.
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

export default authorize;