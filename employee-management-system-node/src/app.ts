import express from "express";
import logger from "morgan";
import cors from "cors";

import "./config/dotenv";
import "./database/mongoose";

import managerRoute from "./routes/manager";
import userRoute from "./routes/user";

import adminRoute from "./routes/admin";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));

app.use("/manager", managerRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);

app.listen(PORT, () => {
  console.log("Server is started at port " + PORT);
});
