const admin = require('firebase-admin');

const serviceAccount = require('./firebase-info.js');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
