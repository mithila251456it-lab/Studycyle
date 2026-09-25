const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Create account, set password for an existing profile, or log in
router.post("/", async (req, res) => {
  try {
    const { name, email, branch, semester, password } = req.body;

    if (!name || !email || !branch || !semester || !password) {
      return res.status(400).json({
        message: "Please fill all required fields."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      // Existing profile has no password yet: set it after profile match
      if (!user.passwordHash) {
        const profileMatches =
          user.name.trim().toLowerCase() === name.trim().toLowerCase() &&
          user.branch === branch &&
          user.semester === semester;

        if (!profileMatches) {
          return res.status(401).json({
            message: "Profile details do not match the existing account."
          });
        }

        user.passwordHash = await bcrypt.hash(password, 12);
        await user.save();
      } else {
        // Existing account: verify password
        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!passwordMatches) {
          return res.status(401).json({
            message: "Invalid email or password."
          });
        }
      }
    } else {
      // New account
      const passwordHash = await bcrypt.hash(password, 12);

      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        branch,
        semester,
        passwordHash
      });
    }

    res.json({
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        semester: user.semester
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not process account. Please try again."
    });
  }
});

// Get users without exposing password hashes
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch users." });
  }
});

module.exports = router;