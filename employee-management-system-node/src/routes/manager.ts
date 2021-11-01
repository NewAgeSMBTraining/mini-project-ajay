import { Request, Response, Router } from "express";
import User, { UserDocument } from "../models/user";
import validator from "validator";
import Manager, { ManagerDocument, ManagerModel } from "../models/manager";
import { managerAuth } from "../middlewares/auth";
import sendEmail from "../helper/nodemailer";
import bcrypt from "bcrypt";
import Leave, { isLeaveStatus, LeaveDocument } from "../models/leaves";

const router = Router();

//manager validator
router.get("/validate", managerAuth, (req: Request, res: Response) => {
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

    const manager: ManagerDocument = await Manager.findByCredentials(
      req.body.email.toString().trim(),
      req.body.password.toString().trim()
    );

    const token: string = await manager.generateAuthToken();

    res.json({ manager: await manager.getPublicProfile(), token });
  } catch (e: any) {
    res.status(404).json({ message: e.message });
  }
});

//get manager data
router.get("/me", managerAuth, async (req: Request, res: Response) => {
  try {
    res.json({ manager: await req.manager.getPublicProfile() });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

//change password
router.patch(
  "/change_password",
  managerAuth,
  async (req: Request, res: Response) => {
    console.log(req.body);

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
        req.manager.password!
      );

      if (!isValid) throw new Error("invalid password");

      req.manager.password = req.body.newpassword.toString().trim();

      await req.manager.save();
      res.send();
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }
);

//logout
router.post("/logout", managerAuth, async (req: Request, res: Response) => {
  try {
    req.manager.tokens = req.manager.tokens!.filter(
      (token) => token.token != req.token
    );
    await req.manager.save();

    res.send();
  } catch (e: any) {
    res.status(500).json({ message: "unable to logout" });
  }
});

//edit profile
router.patch("/edit", managerAuth, async (req: Request, res: Response) => {
  //valid updates
  const validUpdates: string[] = [
    "firstName",
    "lastName",
    "role",
    "phoneNumber",
  ];

  try {
    if (!req.body.updates) throw new Error("invalid updates");

    const updates: string[] = Object.keys(req.body.updates);
    if (updates.length < 1) throw new Error("invalid updates");

    const isValid = updates.every((update) => validUpdates.includes(update));
    if (!isValid) throw new Error("invalid updates");

    //update user
    await Manager.findByIdAndUpdate(req.manager._id, req.body.updates, {
      runValidators: true,
    });

    res.status(202).send();
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

/** manage users */

//list users
router.get("/users", managerAuth, async (req: Request, res: Response) => {
  let skip: number = 0;
  let limit: number = 10;

  if (req.query.skip && !isNaN(+req.query.skip)) skip = +req.query.skip;

  if (req.query.limit && !isNaN(+req.query.limit)) limit = +req.query.limit;

  try {
    const users = await User.find({ manager: req.manager.email })
      .skip(skip)
      .limit(limit);
    res.json(users);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

//search user
router.get("/user", managerAuth, async (req: Request, res: Response) => {
  let skip: number = 0;
  let limit: number = 10;

  if (req.query.skip && !isNaN(+req.query.skip)) skip = +req.query.skip;

  if (req.query.limit && !isNaN(+req.query.limit)) limit = +req.query.limit;

  if (!req.query.search || !req.query.search.toString().trim())
    return res.json([]);

  const search = req.query.search!.toString().trim();

  try {
    const results = await User.find({
      $and: [
        { manager: req.manager.email },
        {
          $or: [
            search.split(" ").length > 1
              ? {
                  $and: [
                    {
                      firstName: {
                        $regex: search.split(" ")[0],
                        $options: "i",
                      },
                    },
                    {
                      lastName: {
                        $regex: search.split(" ")[1],
                        $options: "i",
                      },
                    },
                  ],
                }
              : {
                  $or: [
                    {
                      firstName: {
                        $regex: search,
                        $options: "i",
                      },
                    },
                    {
                      lastName: {
                        $regex: search,
                        $options: "i",
                      },
                    },
                  ],
                },
            {
              email: {
                $regex: search,
                $options: "i",
              },
            },
            {
              role: {
                $regex: search,
                $options: "i",
              },
            },
            {
              phoneNumber: {
                $regex: search,
                $options: "i",
              },
            },
            {
              address: {
                $regex: search,
                $options: "i",
              },
            },
            {
              "academicQualifications.boardUniversity": {
                $regex: search,
                $options: "i",
              },
            },
            {
              "academicQualifications.institute": {
                $regex: search,
                $options: "i",
              },
            },
            {
              "academicQualifications.degreeCertificate": {
                $regex: search,
                $options: "i",
              },
            },
            {
              "academicQualifications.qualifications": {
                $regex: search,
                $options: "i",
              },
            },
            {
              "workExperience.role": {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      ],
    })
      .skip(skip)
      .limit(limit);

    res.json(results);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

//add user
router.post("/user/add", managerAuth, async (req: Request, res: Response) => {
  const user: UserDocument = new User(req.body.data);

  let sendcredentials = false;

  if (req.body.sendcredentials && req.body.sendcredentials === true)
    sendcredentials = true;

  try {
    await user.save();

    if (sendcredentials) {
      sendEmail(
        req.body.data.email,
        "Login Crdentials",
        `Hai ${
          req.body.data.firstName
        }, here is your login credentials.[ 'username' : ${
          req.body.data.email
        } 'password' : ${req.body.data.password.trim()} ]`
      );
    }

    res.status(201).send();
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

//manage user
router.patch(
  "/user/manage",
  managerAuth,
  async (req: Request, res: Response) => {
    //valid updates
    const validUpdates: string[] = [
      "firstName",
      "lastName",
      "email",
      "password",
      "role",
      "dob",
      "gender",
      "phoneNumber",
      "address",
      "social",
      "academicQualifications",
      "workExperience",
      "blocked",
    ];

    try {
      if (!req.body.uId || !req.body.uId.trim())
        throw new Error("invalid user id");

      if (!req.body.updates) throw new Error("invalid updates");

      const updates: string[] = Object.keys(req.body.updates);
      if (updates.length < 1) throw new Error("invalid updates");

      const isValid = updates.every((update) => validUpdates.includes(update));
      if (!isValid) throw new Error("invalid updates");

      //check user exists
      const user: UserDocument | null = await User.findById(
        req.body.uId.trim()
      );
      if (!user) throw new Error("can not find user");

      //update user
      await User.findByIdAndUpdate(req.body.uId.trim(), req.body.updates, {
        runValidators: true,
      });

      res.status(202).send();
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }
);

//delete user
router.delete(
  "/user/delete",
  managerAuth,
  async (req: Request, res: Response) => {
    try {
      if (!req.body.uId || !req.body.uId.trim())
        throw new Error("invalid user id");

      const user: UserDocument | null = await User.findOne({
        _id: req.body.uId.trim(),
      });
      if (!user) throw new Error("can not find user");

      await User.findByIdAndDelete(req.body.uId.trim());

      res.status(202).send();
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }
);

/** manage leaves */

//leave requests list
router.get("/leaves", managerAuth, async (req: Request, res: Response) => {
  let skip: number = 0;
  let limit: number = 10;
  let email: string | null = null;
  let status: string = "pending";
  let from: string | null = null;
  let to: string | null = null;

  if (req.query.skip && !isNaN(+req.query.skip)) skip = +req.query.skip;
  if (req.query.limit && !isNaN(+req.query.limit)) limit = +req.query.limit;
  if (req.query.email && validator.isEmail(req.query.email.toString().trim()))
    email = req.query.email.toString().trim();
  if (req.query.status && isLeaveStatus(req.query.status as string))
    status = req.query.status as string;

  if (
    req.query.from &&
    !isNaN(new Date(req.query.from.toString().trim()).getDate())
  )
    from = req.query.from.toString().trim();

  if (
    req.query.to &&
    !isNaN(new Date(req.query.to.toString().trim()).getDate())
  )
    to = req.query.to.toString().trim();

  let filter: Object = {
    manager: req.manager.email,
    status,
  };

  if (email) filter = { email, ...filter };

  if (from && to) {
    filter = {
      dateFrom: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
      ...filter,
    };
  } else if (from && !to) {
    filter = {
      dateFrom: {
        $gte: new Date(from),
      },
      ...filter,
    };
  } else if (!from && to) {
    filter = {
      dateFrom: {
        $lte: new Date(to),
      },
      ...filter,
    };
  }

  try {
    const leaves = await Leave.find(filter).skip(skip).limit(limit);

    console.log(filter);

    console.log(leaves);

    res.json({ leaves });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

//approve or reject leave
router.post(
  "/leave/status",
  managerAuth,
  async (req: Request, res: Response) => {
    try {
      if (
        !req.body.uId ||
        !req.body.uId.toString().trim() ||
        !req.body.leaveId ||
        !req.body.leaveId.toString().trim() ||
        !req.body.status ||
        !isLeaveStatus(req.body.status)
      )
        throw new Error();

      const leaveId: string = req.body.leaveId.toString().trim();

      const leave: LeaveDocument | null = await Leave.findOne({
        _id: leaveId,
      });

      if (!leave) throw new Error();

      leave.status = req.body.status;

      await leave.save();

      if (leave.notifications) {
        sendEmail(
          leave.email,
          "Leave Status",
          `Hi, your leave request from ${leave.dateFrom} to ${
            leave.dateTo
          } has been ${req.body.status} by ${
            req.manager.firstName + " " + req.manager.lastName
          }`
        );
      }

      res.send();
    } catch (e: any) {
      res.status(406).json();
    }
  }
);

export default router;
