import { Request, Response, Router } from "express";
import User, { Leave, UserDocument } from "../models/user";
import validator from "validator";
import { userAuth } from "../middlewares/auth";
import bcrypt from "bcrypt";

const router = Router();

//user validator
router.get("/validate", userAuth, (req: Request, res: Response) => {
  res.status(200).json({ message: "authentication successfull" });
});

//login
router.post("/login", async (req: Request, res: Response) => {
  try {
    if (
      !req.body.email ||
      !validator.isEmail(req.body.email.toString().trim()) ||
      !req.body.password ||
      !req.body.password.toString().trim()
    )
      throw new Error("unable to login");

    const user: UserDocument = await User.findByCredentials(
      req.body.email.toString().trim(),
      req.body.password.toString().trim()
    );

    const token: string = await user.generateAuthToken();

    res.json({
      user: await user.getPublicProfile(),
      token,
    });
  } catch (e: any) {
    res.status(404).json({ message: e.message });
  }
});

//change password
router.patch(
  "/change_password",
  userAuth,
  async (req: Request, res: Response) => {
    try {
      if (
        !req.body.oldpassword ||
        !req.body.oldpassword.toString().trim() ||
        !req.body.newpassword ||
        !req.body.newpassword.toString().trim()
      )
        throw new Error("invalid input");

      const isValid = await bcrypt.compare(
        req.body.oldpassword,
        req.user.password!
      );

      if (!isValid) throw new Error("invalid password");

      req.user.password = req.body.newpassword.toString().trim();

      await req.user.save();
      res.send();
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }
);

//get user data
router.get("/me", userAuth, async (req: Request, res: Response) => {
  try {
    res.json({ user: await req.user.getPublicProfile() });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

//logout
router.post("/logout", userAuth, async (req: Request, res: Response) => {
  try {
    req.user.tokens = req.user.tokens!.filter(
      (token) => token.token != req.token
    );
    await req.user.save();
    res.send();
  } catch (e: any) {
    res.status(500).send();
  }
});

//view leave requests
router.get("/leaves", userAuth, async (req: Request, res: Response) => {
  try {
    res.json(req.user.leaveRequests);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

//apply for leave
router.post("/leave", userAuth, async (req: Request, res: Response) => {
  try {
    if (!req.body.dateFrom || !req.body.dateFrom.trim())
      throw new Error("invalid date");
    if (!req.body.dateTo || !req.body.dateTo.trim())
      throw new Error("invalid date");

    if (!req.body.summary || !req.body.summary.trim())
      throw new Error("invalid summary");

    const dateFrom: Date = new Date(req.body.dateFrom.trim());
    if (isNaN(dateFrom.getDate())) throw new Error("invalid date");

    const dateTo: Date = new Date(req.body.dateTo.trim());
    if (isNaN(dateFrom.getDate())) throw new Error("invalid date");

    const leave: Leave = {
      dateFrom: dateFrom,
      dateTo: dateTo,
      summary: req.body.summary.trim(),
    };

    //add leave request
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          leaveRequests: leave,
        },
      },
      {
        runValidators: true,
      }
    );

    res.send();
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

//edit profile
router.patch("/edit", userAuth, async (req: Request, res: Response) => {
  //valid updates
  const validUpdates: string[] = [
    "firstName",
    "lastName",
    "password",
    "role",
    "dob",
    "gender",
    "phoneNumber",
    "address",
    "social",
    "academicQualifications",
    "workExperience",
  ];

  try {
    if (!req.body.updates) throw new Error("invalid updates");

    const updates: string[] = Object.keys(req.body.updates);
    if (updates.length < 1) throw new Error("invalid updates");

    const isValid = updates.every((update) => validUpdates.includes(update));
    if (!isValid) throw new Error("invalid updates");

    //update user
    await User.findByIdAndUpdate(req.user._id, req.body.updates, {
      runValidators: true,
    });

    res.status(202).send();
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

export default router;