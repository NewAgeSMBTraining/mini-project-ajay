import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import User, { UserDocument } from "../models/user";
import Manager, { ManagerDocument } from "../models/manager";

export const userAuth: RequestHandler = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) throw new Error("");

    const token: string = req.header("Authorization")!.replace("Bearer ", "");
    const decoded = await jwt.verify(token, process.env.TOKEN_SECRET!);

    const user: UserDocument | null = await User.findOne({
      _id: (<any>decoded)._id,
      "tokens.token": token,
    });

    if (!user) throw new Error("");

    req.user = user;
    req.token = token;

    next();
  } catch (e: any) {
    res.status(401).json({ message: "Authorization Error" });
  }
};

export const managerAuth: RequestHandler = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) throw new Error("");

    const token: string = req.header("Authorization")!.replace("Bearer ", "");
    const decoded = await jwt.verify(token, process.env.TOKEN_SECRET!);

    const manager: ManagerDocument | null = await Manager.findOne({
      _id: (<any>decoded)._id,
      "tokens.token": token,
    });

    if (!manager) throw new Error("");

    req.manager = manager;
    req.token = token;

    next();
  } catch (e: any) {
    res.status(401).json({ message: "Authorization Error" });
  }
};
