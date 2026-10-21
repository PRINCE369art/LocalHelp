const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Checks the "Authorization: Bearer <token>" header
async function protect(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: "Please login first." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "User no longer exists." });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Session expired. Please login again." });
    }
}

// Allows only the given role(s)
function allowRoles(...roles) {
    return function (req, res, next) {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "You are not allowed to do this." });
        }
        next();
    };
}

module.exports = { protect, allowRoles };
