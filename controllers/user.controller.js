import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const register = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Please enter username and password",
    });
  }

  try {
    await User.create({ username, password });

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Please enter username and password",
    });
  }

  try {
    const user = await User.findOne({ username }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Incorrect username or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    user.password = undefined;

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      status: true,
      data: {
        user,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(204);

  const cookieOptions = {
    httpOnly: true,
    sameSite: "none",
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.clearCookie("token", cookieOptions);
  res.json({
    message: "Logged out successfully",
  });
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: true,
      results: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

export { register, login, logout, getAllUsers };
