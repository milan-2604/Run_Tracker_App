import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = "3d";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, weight } = req.body;

    if (!name || !email || !password || !weight) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    const newUser: IUser = new User({ name, email, password, weight });
    await newUser.save(); // pre-save hook will hash the password

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const { password: _, ...userData } = newUser.toObject();

    res.status(201).json({
      message: "User registerd Successfully",
      user: userData,
      token,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
