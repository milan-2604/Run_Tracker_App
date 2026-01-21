import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET; 
const JWT_EXPIRES_IN = "3d";
if(!JWT_SECRET){
  throw new Error("JWT_SECRET not defined");
}

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

    const token = jwt.sign({ _id: newUser._id }, JWT_SECRET, {
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



export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordMatched = await existingUser.authenticate(password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { _id: existingUser._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _, ...userData } = existingUser.toObject();

    return res.status(200).json({
      message: "User signin successful",
      user: userData,
      token,
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
