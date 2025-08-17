
const dotenv = require('dotenv');
dotenv.config({path:'./smart-food-app-backend/.env'});

const mongoose = require('mongoose');
const app = require('./app');
const runExpiryJob = require('./jobs/expiryJob');

const DB = process.env.MONGODB_URL.replace('<db_password>', process.env.MONGODB_PASSWORD);
mongoose.connect(DB)
  .then(()=> console.log('DB connection successful'))
  .catch((err)=> { console.error('DB connection error:', err.message); process.exit(1); });

runExpiryJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
