// Run once:  npm run seed   -> adds demo providers + a demo customer
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const providers = [
    { name: "Rajesh Kumar", email: "rajesh@localhelp.com", service: "Electrician", location: "Vapi", availability: "Available", rating: 4.8, reviews: 42, description: "Experienced electrician providing residential electrical services." },
    { name: "Amit Patel", email: "amit@localhelp.com", service: "Plumber", location: "Sarigam", availability: "Available", rating: 4.7, reviews: 35, description: "Reliable plumber for leakage, fitting and repair work." },
    { name: "Suresh Sharma", email: "suresh@localhelp.com", service: "Carpenter", location: "Vapi", availability: "Busy", rating: 4.6, reviews: 28, description: "Furniture repair, doors, windows and custom woodwork." },
    { name: "Neha Joshi", email: "neha@localhelp.com", service: "Cleaner", location: "Daman", availability: "Available", rating: 4.9, reviews: 51, description: "Home and office deep cleaning services." },
    { name: "Vikram Shah", email: "vikram@localhelp.com", service: "Computer Repair", location: "Vapi", availability: "Available", rating: 4.5, reviews: 19, description: "Laptop and desktop repair, software and network issues." }
];

(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const pwd = await bcrypt.hash("provider123", 10);
    for (const p of providers) {
        await User.updateOne(
            { email: p.email },
            { $setOnInsert: { ...p, phone: "9876543210", role: "provider", password: pwd } },
            { upsert: true }
        );
    }

    await User.updateOne(
        { email: "customer@localhelp.com" },
        { $setOnInsert: { name: "Demo Customer", email: "customer@localhelp.com", phone: "9123456780", role: "customer", password: await bcrypt.hash("customer123", 10) } },
        { upsert: true }
    );

    console.log("Seed done.");
    console.log("Provider login: rajesh@localhelp.com / provider123");
    console.log("Customer login: customer@localhelp.com / customer123");
    await mongoose.disconnect();
})();
