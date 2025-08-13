import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

//Required SignIn
// Middleware to require sign-in using HTTP-only cookie
export const requireSignIn = async (req, res, next) => {
  try {
    // Log to debug cookie issues
    console.log("Incoming Cookies:", req.cookies);

    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized - No token found" });
    }

    // verify token

    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    // Fetch full user details from db 
    const user = await userModel.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ success: false, message: "Unauthorized - Invalid or expired token" });
  }
};

// check admin access
// Middleware to check if the user is admin
export const isAdmin = async (req, res, next) => {
  try {
    
    if (!req.user || req.user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Admin access only",
      });
    }
    next();
  } catch (error) {
    console.error("Admin check failed:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in admin middleware",
      error,
    });
  }
};