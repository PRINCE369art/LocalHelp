const mongoose = require("mongoose");

// One collection for both customers and providers (role decides which).
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, minlength: 3 },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, required: true, match: /^[0-9]{10}$/ },
        password: { type: String, required: true, minlength: 6, select: false },
        role: { type: String, enum: ["customer", "provider"], required: true },

        // Provider-only fields
        service: {
            type: String,
            enum: ["Electrician", "Plumber", "Carpenter", "Cleaner", "Computer Repair"]
        },
        location: { type: String, trim: true },
        description: { type: String, trim: true, default: "" },
        availability: { type: String, enum: ["Available", "Busy"], default: "Available" },
        rating: { type: Number, default: 0 },
        reviews: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
