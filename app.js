import express from 'express';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';

import { PORT } from './config/env.js';

const app = express();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the subscription tracker API');
});

app.listen(PORT, () => {
console.log(`Subscription tracker API is running on http://localhost:${ PORT }`);
})

export default app;