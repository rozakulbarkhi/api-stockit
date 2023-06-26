import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authorized to access this resource",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    const user = await User.findById(decoded.id);

    if (!user)
      return res
        .status(401)
        .json({ message: "Not authorized to access this resource" });

    req.user = user;

    next();
  });
};
