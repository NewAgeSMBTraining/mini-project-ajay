import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_URL!, {})
  .then(() => {
    console.log("database successfully connected");
  })
  .catch((err) => {
    console.log(err);
  });
