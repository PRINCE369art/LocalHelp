const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        // null = open request (any provider of that service can pick it up)
        provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        rejectedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        service: {
            type: String,
            required: true,
            enum: ["Electrician", "Plumber", "Carpenter", "Cleaner", "Computer Repair"]
        },
        description: { type: String, required: true, trim: true, minlength: 5 },
        location: { type: String, required: true, trim: true },
        date: { type: Date, required: true },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected", "Completed"],
            default: "Pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("ServiceRequest", requestSchema);
