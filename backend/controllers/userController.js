import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please Fill All The Input");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send("User Already Exist, Try Another Email");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    createToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      // password: newUser.password,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser?.password
    );
    if (isPasswordValid) {
      createToken(res, existingUser._id);
      res.status(201).json({
        _id: existingUser._id,
        email: existingUser.email,
        // password: existingUser.password,
        username: existingUser?.username,
        isAdmin: existingUser.isAdmin,
      });
      return;
    } else {
      return res.status(400).send("Invalid User ");
    }
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(),
  });

  res.status(200).json({ message: "User Logout Successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (user) {
    res.json({
      _id: user?._id,
      username: user?.username,
      email: user?.email,
    });
  } else {
    res.status(404);
    throw new Eror("User Not Exist In The World");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user?.isAdmin) {
      res.status(400);
      throw new Error("Can Not Delete An Admin");
    }
    await User.deleteOne({ _id: user?._id });
    res.json({ message: "User Removed From Database" });
  } else {
    res.status(404);
    throw new Error("User Not Exists In The World");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
