const express = require("express");
const router = express.Router();
const User = require("../models/user-model");
const verifyUser = require("../middlewares/auth");


router.post("/login", verifyUser, async (req, res) => {
    const { name, email } = req.user;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({ user });
        }
        else {
            const newUser = await User.create({ name, email });
            return res.status(200).json({ user: newUser });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;