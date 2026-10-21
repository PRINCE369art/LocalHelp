const express = require("express");
const User = require("../models/User");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

// GET /api/providers?service=Plumber&availability=Available&search=raj
router.get("/", async (req, res) => {
    try {
        const filter = { role: "provider" };

        if (req.query.service && req.query.service !== "all") {
            filter.service = req.query.service;
        }
        if (req.query.availability && req.query.availability !== "all") {
            filter.availability = req.query.availability;
        }
        if (req.query.search) {
            const safe = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const rx = new RegExp(safe, "i");
            filter.$or = [{ name: rx }, { service: rx }, { location: rx }];
        }

        const providers = await User.find(filter).sort({ rating: -1, name: 1 });
        res.json(providers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/providers/me/availability  (provider updates own status)
// (defined before "/:id" so "me" is not treated as an id)
router.put("/me/availability", protect, allowRoles("provider"), async (req, res) => {
    const { availability } = req.body;

    if (!["Available", "Busy"].includes(availability)) {
        return res.status(400).json({ message: "Availability must be Available or Busy." });
    }

    req.user.availability = availability;
    await req.user.save();
    res.json({ availability });
});

// GET /api/providers/:id
router.get("/:id", async (req, res) => {
    try {
        const provider = await User.findOne({ _id: req.params.id, role: "provider" });
        if (!provider) {
            return res.status(404).json({ message: "Provider not found." });
        }
        res.json(provider);
    } catch (err) {
        res.status(400).json({ message: "Invalid provider id." });
    }
});

module.exports = router;
