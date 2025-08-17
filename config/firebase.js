const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const servicePath = path.join(__dirname, 'firebase-service-account.json');
if (fs.existsSync(servicePath)) {
  admin.initializeApp({ credential: admin.credential.cert(require(servicePath)) });
} else {
  console.warn('⚠️ Firebase service account JSON not found. Notifications disabled.');
}

module.exports = admin;
