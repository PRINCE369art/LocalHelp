const express = require("express");
const ServiceRequest = require("../models/ServiceRequest");
const User = require("../models/User");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// CREATE  POST /api/requests   (customer)
router.post("/", allowRoles("customer"), async (req, res) => {
    try {
        const { service, description, location, date, providerId } = req.body;

        let provider = null;
        if (providerId) {
            const p = await User.findOne({ _id: providerId, role: "provider" });
            if (!p) {
                return res.status(404).json({ message: "Selected provider not found." });
            }
            provider = p._id;
        }

        const request = await ServiceRequest.create({
            customer: req.user._id,
            provider,
            service,
            description,
            location,
            date
        });

        res.status(201).json({ message: "Service request created successfully!", request });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ  GET /api/requests/my   (customer's own requests)
router.get("/my", allowRoles("customer"), async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ customer: req.user._id })
            .populate("provider", "name phone")
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READ  GET /api/requests/provider
// = requests sent to me + open requests for my service
router.get("/provider", allowRoles("provider"), async (req, res) => {
    try {
        const requests = await ServiceRequest.find({
            $or: [
                { provider: req.user._id },
                {
                    provider: null,
                    service: req.user.service,
                    status: "Pending",
                    rejectedBy: { $ne: req.user._id }
                }
            ]
        })
            .populate("customer", "name phone")
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE  PUT /api/requests/:id/status   (provider: accept / reject / complete)
router.put("/:id/status", allowRoles("provider"), async (req, res) => {
    try {
        const action = req.body.status;
        const request = await ServiceRequest.findById(req.params.id);

        if (!request) return res.status(404).json({ message: "Request not found." });

        const mine = request.provider && request.provider.equals(req.user._id);
        const open = !request.provider && request.service === req.user.service;

        if (!mine && !open) {
            return res.status(403).json({ message: "This request is not for you." });
        }

        if (action === "Accepted") {
            if (request.status !== "Pending") {
                return res.status(400).json({ message: "Request is no longer pending." });
            }
            request.provider = req.user._id;
            request.status = "Accepted";
        } else if (action === "Rejected") {
            if (request.status !== "Pending") {
                return res.status(400).json({ message: "Request is no longer pending." });
            }
            if (mine) {
                request.status = "Rejected";
            } else {
                request.rejectedBy.push(req.user._id); // open request: just hide it for me
            }
        } else if (action === "Completed") {
            if (!mine || request.status !== "Accepted") {
                return res.status(400).json({ message: "Only accepted jobs can be completed." });
            }
            request.status = "Completed";
        } else {
            return res.status(400).json({ message: "Invalid status." });
        }

        await request.save();
        res.json({ message: "Request " + action.toLowerCase() + ".", request });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE  PUT /api/requests/:id   (customer edits own Pending request)
router.put("/:id", allowRoles("customer"), async (req, res) => {
    try {
        const request = await ServiceRequest.findOne({ _id: req.params.id, customer: req.user._id });

        if (!request) return res.status(404).json({ message: "Request not found." });
        if (request.status !== "Pending") {
            return res.status(400).json({ message: "Only pending requests can be edited." });
        }

        const { description, location, date } = req.body;
        if (description) request.description = description;
        if (location) request.location = location;
        if (date) request.date = date;

        await request.save();
        res.json({ message: "Request updated.", request });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE  DELETE /api/requests/:id   (customer cancels own request)
router.delete("/:id", allowRoles("customer"), async (req, res) => {
    try {
        const request = await ServiceRequest.findOne({ _id: req.params.id, customer: req.user._id });

        if (!request) return res.status(404).json({ message: "Request not found." });
        if (request.status === "Completed") {
            return res.status(400).json({ message: "Completed requests cannot be deleted." });
        }

        await request.deleteOne();
        res.json({ message: "Request cancelled." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
