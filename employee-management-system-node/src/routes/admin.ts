import { Request, Response, Router } from "express";
import Manager from "../models/manager";
import User from "../models/user";
import validator from "validator";
import sendEmail from "../helper/nodemailer";
import bycrypt from "bcrypt";

const router = Router();

router.post("/add", async (req: Request, res: Response) => {
  try {
    const manager = new Manager(req.body);
    await manager.save();
    res.send(manager);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

//forgot password
router.post("/forgot_password", async (req: Request, res: Response) => {
  try {
    if (
      !req.body.email ||
      !req.body.email.trim() ||
      !validator.isEmail(req.body.email.trim())
    )
      throw new Error("invalid input");

    const email = req.body.email.trim();

    const user = await User.findOne({ email });

    if (user) {
      const encryptedToken = await user.generateResetToken();

      sendEmail(
        email,
        "Reset Password",
        `Click this link to reset your password http://localhost:3001/#/reset_password/${encryptedToken}?account=${email}`
      );

      return res.send();
    }

    const manager = await Manager.findOne({ email });

    if (manager) {
      const encryptedToken = await manager.generateResetToken();

      sendEmail(
        email,
        "Reset Password",
        `Click this link to reset your password http://localhost:3001/#/reset_password/${encryptedToken}?account=${email}`
      );

      return res.send();
    }

    res.send();
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

//forgot password token validator
router.get(
  "/reset_password/token_validator/:token",
  async (req: Request, res: Response) => {
    try {
      if (
        !req.query.account ||
        !req.query.account.toString().trim() ||
        !validator.isEmail(req.query.account.toString().trim()) ||
        !req.params.token ||
        !req.params.token.toString().trim()
      )
        throw new Error("invalid account");

      const email = req.query.account!.toString().trim();

      const user = await User.findOne({ email });

      if (user) {
        const resetToken = user.resetTokens?.filter(
          async (token) => await bycrypt.compare(token.token, req.params.token)
        );

        if (!resetToken?.length) throw new Error("invalid account");

        return res.json({ token: resetToken[0].token, email });
      }

      const manager = await Manager.findOne({ email });

      if (manager) {
        const resetToken = manager.resetTokens?.filter(
          async (token) => await bycrypt.compare(token.token, req.params.token)
        );

        if (!resetToken?.length) throw new Error("invalid account");

        return res.json({ token: resetToken[0].token, email });
      }

      throw new Error("invalid account");
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }
);

//reset password
router.post("/reset_password", async (req: Request, res: Response) => {
  try {
    if (
      !req.body.email ||
      !req.body.email.toString().trim() ||
      !validator.isEmail(req.body.email.toString().trim()) ||
      !req.body.token ||
      !req.body.token.toString().trim() ||
      !req.body.password ||
      !req.body.password.toString().trim() ||
      !validator.isStrongPassword(req.body.password.toString().trim())
    )
      throw new Error("invalid input");

    const email = req.body.email.toString().trim();
    const token = req.body.token.toString().trim();

    console.log(token);

    const user = await User.findOne({ email, "resetTokens.token": token });

    if (user) {
      user.password = req.body.password.trim();

      user.resetTokens = [];

      await user.save();

      return res.json({ message: "password changed successfully" });
    }

    const manager = await Manager.findOne({ email });

    if (manager) {
      manager.password = req.body.password.trim();

      manager.resetTokens = [];

      await manager.save();

      return res.json({ message: "password changed successfully" });
    }

    throw new Error("invalid account");
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
