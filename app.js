const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { errorHandler } = require('./utils/errorHandler');

const authRoutes = require('./routes/authroute');
const userRoutes = require('./routes/userroute');
const foodRoutes = require('./routes/foodroute');
const leaderboardRoutes = require('./routes/leaderBoardroute');
const analyticsRoutes = require('./routes/analyticsroute');

const runAnalyticsJob = require('./jobs/analyticsJob');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/analytics', analyticsRoutes);

// Jobs
runAnalyticsJob();

// Error handler
app.use(errorHandler);

module.exports = app;
