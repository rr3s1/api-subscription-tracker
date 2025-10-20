// Import necessary modules for database operations, authentication, and configuration.
import mongoose from 'mongoose';
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

// --- SIGN UP CONTROLLER ---
export const signUp = async (req, res, next) => {
    // Start a new Mongoose session to handle the transaction.
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Extract user details from the request body.
        const { name, email, password } = req.body;

        // --- VALIDATION ---
        // Check if a user with the provided email already exists.
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409; // HTTP status for Conflict.
            throw error; // This will be caught by the catch block.
        }

        // --- PASSWORD HASHING ---
        // Generate a salt and hash the user's password for secure storage.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- USER CREATION ---
        // Create the new user within the database transaction.
        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });

        // --- JWT GENERATION ---
        // Create a JSON Web Token for the new user.
        const token = jwt.sign(
            { userId: newUsers[0]._id }, // Payload containing the user's ID.
            JWT_SECRET,                  // The secret key for signing the token.
            { expiresIn: JWT_EXPIRES_IN } // The token's expiration time.
        );

        // --- TRANSACTION COMMIT ---
        // If all operations succeed, commit the transaction to save the changes.
        await session.commitTransaction();
        session.endSession();

        // --- SUCCESS RESPONSE ---
        // Send a 201 Created response with the token and user data.
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0],
            }
        });

    } catch (error) {
        // --- TRANSACTION ROLLBACK ---
        // If any error occurs, abort the transaction to undo all changes.
        await session.abortTransaction();
        session.endSession();
        // Pass the error to the global error-handling middleware.
        next(error);
    }
};

// Placeholder for the sign-in controller function.
export const signIn = async (req, res, next) => { };

// Placeholder for the sign-out controller function.
export const signOut = async (req, res, next) => { };