const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

function makeToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(u) {
    return {
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        service: u.service,
        location: u.location,
        availability: u.availability
    };
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, password, role, service, location } = req.body;

        if (!name || name.trim().length < 3) {
            return res.status(400).json({ message: "Please enter a valid name." });
        }
        if (!/^\S+@\S+\.\S+$/.test(email || "")) {
            return res.status(400).json({ message: "Please enter a valid email." });
        }
        if (!/^[0-9]{10}$/.test(phone || "")) {
            return res.status(400).json({ message: "Please enter a valid 10-digit phone number." });
        }
        if (!["customer", "provider"].includes(role)) {
            return res.status(400).json({ message: "Please select your role." });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must contain at least 6 characters." });
        }
        if (role === "provider" && (!service || !location)) {
            return res.status(400).json({ message: "Providers must enter service type and location." });
        }

        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) {
            return res.status(409).json({ message: "This email is already registered." });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone,
            password: hashed,
            role,
            service: role === "provider" ? service : undefined,
            location: role === "provider" ? location : undefined
        });

        res.status(201).json({
            message: "Registration successful!",
            token: makeToken(user._id),
            user: publicUser(user)
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter email and password." });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
        const ok = user && (await bcrypt.compare(password, user.password));

        if (!ok) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        res.json({
            message: "Login successful!",
            token: makeToken(user._id),
            user: publicUser(user)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => {
    res.json({ user: publicUser(req.user) });
});

module.exports = router;
