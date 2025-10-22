// utils/send-email.js

import { emailTemplates } from './email-template.js';
import dayjs from 'dayjs';
import transporter, { accountEmail } from '../config/nodemailer.js';

export const sendReminderEmail = async ({ to, type, subscription }) => {
    if (!to || !type) throw new Error('Missing required parameters');

    const template = emailTemplates.find((t) => t.label === type);
    if (!template) throw new Error('Invalid email type');

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
    };

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: subject,
        html: message,
    };

    // Use a try...catch block for robust error handling with async/await

    try {
        console.log('Attempting to send email...'); // <-- Add this log
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response); // <-- More detailed success log
    } catch (error) {
        // This will now provide a full error object for better debugging
        console.error('--- NODEMAILER ERROR ---');
        console.error('Failed to send email. Error:', error);
        console.error('------------------------');
    }
};