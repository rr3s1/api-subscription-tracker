// Import necessary libraries and models.
import dayjs from 'dayjs';
import { createRequire } from 'module';
import Subscription from "../models/subscription.model.js";

// Use createRequire to import CommonJS modules in an ES module environment.
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

// Define the intervals (in days) for sending reminders before the renewal date.
const REMINDERS = [7, 5, 2, 1];

// --- WORKFLOW DEFINITION ---
// The main workflow logic is wrapped in the 'serve' function from Upstash.
export const sendReminders = serve(async (context) => {
    // Extract the subscriptionId from the workflow's payload.
    const { subscriptionId } = context.requestPayload;
    // Fetch the full subscription details from the database.
    const subscription = await fetchSubscription(context, subscriptionId);

    // If the subscription doesn't exist or is not active, terminate the workflow.
    if (!subscription || subscription.status !== 'active') return;

    // Use dayjs for robust date handling.
    const renewalDate = dayjs(subscription.renewalDate);

    // If the renewal date has already passed, log it and terminate.
    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }

    // Loop through the predefined reminder intervals.
    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        // If the calculated reminder date is in the future, schedule a sleep.
        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        // If today is the reminder date, trigger the reminder action.
        if (dayjs().isSame(reminderDate, 'day')) {
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }
    }
});

// Helper function to fetch subscription details within a workflow step.
const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    });
};

// Helper function to pause the workflow until a specific date.
const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
};

// Helper function to execute the reminder action (e.g., send an email).
const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);
        // Logic to send an email will be implemented here.
    });
};