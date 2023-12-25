import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // read the jwt from the jwt cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized Or Token Failed");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized Or No Token ");
  }
});

// check for the admin
const authorizedAdmin = (req, res, next) => {
  if (req.user && req.user?.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized Or Admin Permission Not Allowed ");
  }
};

export { authenticate, authorizedAdmin };
