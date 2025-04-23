import User from "../models/Users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// token generate

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate user input
  if (!email || !password) {
    return res.status(400).json({ success : false, message: "All fields are required" });
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, email, password: hashedPassword });

  const token = generateToken(newUser._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    success: true,
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
  });
};

export const loginUser = async (req, res) => {

    const {email, password} = req.body

    const user = await User.findOne({email})

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found"})
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }
    )

    res.status(200).json({
        success: true,
        _id: user._id,
        username: user.username,
        email: user.email,
      });

}

// Logout user
export const logoutUser = (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // secure in prod
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  };
  