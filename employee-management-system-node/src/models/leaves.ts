import { Document, model, ObjectId, Schema } from "mongoose";
import validator from "validator";

export interface LeaveDocument extends Document {
  email: string;
  dateFrom: Date;
  dateTo: Date;
  summary: string;
  status?: LeaveStatus;
  user: ObjectId;
}

export type LeaveStatus = "approved" | "rejected" | "pending";

export const isLeaveStatus = (val: string): boolean =>
  val === "approved" || val === "rejected" || val === "pending" ? true : false;

const leaveSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value: any) {
      if (!validator.isEmail(value.toString()))
        throw new Error("email is invalid");
    },
  },
  dateFrom: {
    type: Date,
    required: true,
    trim: true,
  },
  dateTo: {
    type: Date,
    required: true,
    trim: true,
  },
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    default: "pending",
    type: String,
    validate(value: any) {
      if (!isLeaveStatus(value)) throw new Error("not a valid status");
    },
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Leave = model<LeaveDocument>("Leave", leaveSchema);

export default Leave;
