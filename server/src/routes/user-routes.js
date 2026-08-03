const express = require("express");
const router = express.Router();
const User = require("../models/user-model");
const verifyUser = require("../middlewares/auth");


router.post("/login", verifyUser, async (req, res) => {
    const { name, email } = req.user;
    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(200).json({ status: true, message: "User found", user });
        }
        else {
            const newUser = await User.create({ name, email });
            return res.status(201).json({ status: true, message: "User created", user: newUser });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
});



module.exports = router;