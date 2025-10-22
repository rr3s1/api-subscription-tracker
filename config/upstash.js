// Import the Upstash WorkflowClient and environment variables.
import { Client as WorkflowClient } from '@upstash/workflow';
import { QSTASH_TOKEN, QSTASH_URL } from './env.js';

// Initialize and export the workflow client with credentials from environment variables.
export const workflowClient = new WorkflowClient({
    baseUrl: QSTASH_URL,
    token: QSTASH_TOKEN,
});