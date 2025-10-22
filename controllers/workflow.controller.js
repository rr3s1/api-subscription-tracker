// controllers/workflow.controller.js

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import { createRequire } from 'module';
import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";

// This is required for advanced date comparison in dayjs
dayjs.extend(isSameOrAfter);

const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

const REMINDERS = [7, 5, 2, 1];

// This is the main workflow function
export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }

    // The single, main loop for scheduling and triggering
    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        // Check if the reminder date is today or in the future
        if (reminderDate.isSameOrAfter(dayjs(), 'day')) {
            const label = `${daysBefore} days before reminder`;

            // Put the workflow to sleep until the calculated reminder date
            await context.sleepUntil(label, reminderDate.toDate());

            // When the workflow wakes up, it will execute this part
            console.log(`Woke up for: ${label}`);

            // Now, run the actual reminder logic (which includes sending the email)
            await triggerReminder(context, label, subscription);
        }
    }
});

// Helper to fetch the subscription data
const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return await Subscription.findById(subscriptionId).populate('user', 'name email');
    });
};

// This is the ONLY triggerReminder function. It sends the email.
const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Executing action for: ${label}`);

        // This is where the email is actually sent
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        });
    });
};