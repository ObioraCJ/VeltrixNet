import { User } from "../models/index.js";
import generateToken from "../utils/generateToken.js";

const userResponse = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  houseAddress: user.houseAddress,
  role: user.role,
});

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, houseAddress, password } = req.body;

    if (!name || !email || !houseAddress || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    if (exists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // role is always "customer" here, so nobody can make themselves admin
    const user = await User.create({ name, email, houseAddress, password });

    res.status(201).json({
      user: userResponse(user),
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.scope("withPassword").findOne({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      user: userResponse(user),
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/me
export const getMe = async (req, res) => {
  res.json({ user: userResponse(req.user) });
};