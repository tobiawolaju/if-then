const admin = require('firebase-admin');
const path = require('path');

// Render provides secrets at /etc/secrets/
const serviceAccountPath = process.env.RENDER
    ? '/etc/secrets/serviceAccountKey.json'
    : path.join(__dirname, 'serviceAccountKey.json');

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://everyotherday-db39f-default-rtdb.firebaseio.com"
});

const db = admin.database();
console.log("Firebase Admin initialized");

module.exports = { admin, db };
