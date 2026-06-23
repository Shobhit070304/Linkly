const admin = require('../utils/firebase');
const crypto = require('crypto');

const hashKey = (key) => crypto.createHash('sha256').update(key).digest('hex');

const Workspace = require('../models/workspace-model');
const User = require('../models/user-model');

async function verifyUser(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized, token missing' });
    }

    const token = authHeader.split('Bearer ')[1];

    // --- Path 1: API Key Authentication ---
    if (token.startsWith('linkly_sk_')) {
        try {
            const apiKeyHash = hashKey(token);
            const workspace = await Workspace.findOne({ where: { apiKeyHash } });

            if (!workspace) {
                return res.status(401).json({ error: 'Unauthorized, invalid API key' });
            }

            const user = await User.findOne({ where: { id: workspace.userId } });
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized, workspace owner not found' });
            }

            // Attach workspace and user info for downstream controllers
            req.workspace = workspace;
            req.user = {
                uid: null,
                email: user.email,
                name: user.name,
            };
            return next();
        } catch (error) {
            console.error('API key auth error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // --- Path 2: Firebase JWT Authentication ---
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name || null,
        };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized, invalid token' });
    }
}

module.exports = verifyUser;
