const admin = require('../utils/firebase');

async function verifyUser(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized, token missing' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        // Attach user info to req.user
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name || null,
        };
        next();
    } catch (error) {
        console.error('Firebase token verification failed:', error);
        return res.status(401).json({ error: 'Unauthorized, invalid token' });
    }
}

module.exports = verifyUser;
