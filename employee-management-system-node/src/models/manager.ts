import { Document, Model, model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";
import validator from "validator";

export interface ManagerDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  role: string;
  tokens?: { token: string }[];
  resetTokens?: { token: string }[];
  generateAuthToken(): string;
  generateResetToken(): string;
  getPublicProfile(): ManagerDocument;
}

export interface ManagerModel extends Model<ManagerDocument> {
  findByCredentials(email: string, password: string): ManagerDocument;
}

const managerSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value: any) {
      if (!validator.isEmail(value.toString()))
        throw new Error("email is invalid");
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value: any) {
      if (!validator.isStrongPassword(value.toString()))
        throw new Error("password is invalid");
    },
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    validate(value: any) {
      if (!validator.isMobilePhone(value.toString()))
        throw new Error("phone number is invalid");
    },
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  resetTokens: [
    {
      token: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
});

managerSchema.methods.generateAuthToken = async function () {
  const manager: ManagerDocument = this as ManagerDocument;
  const token: string = await jwt.sign(
    {
      _id: manager._id,
    },
    process.env.TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  manager.tokens = manager.tokens!.concat({ token });

  await manager.save();
  return token;
};

managerSchema.methods.generateResetToken = async function () {
  const manager: ManagerDocument = this as ManagerDocument;
  const token: string = jwt.sign(
    {
      _id: manager._id,
    },
    process.env.TOKEN_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  manager.resetTokens = manager.resetTokens!.concat({ token });
  await manager.save();

  const encryptedToken = await bycrypt.hash(token, 8);
  return encryptedToken;
};

managerSchema.methods.getPublicProfile = async function () {
  const manager: ManagerDocument = this as ManagerDocument;

  const managerObject = manager.toObject();
  delete managerObject.password;
  delete managerObject.tokens;
  delete managerObject.resetTokens;

  return managerObject;
};

managerSchema.statics.findByCredentials = async function (
  email: string,
  password: string
) {
  const manager: ManagerDocument | null = await Manager.findOne({ email });
  if (!manager) throw new Error("unable to login");

  const isMatch = await bycrypt.compare(password, manager.password!);
  if (!isMatch) throw new Error("unable to login");

  return manager;
};

managerSchema.pre("save", async function (next) {
  const manager: ManagerDocument = this as ManagerDocument;

  if (manager.isModified("password")) {
    manager.password = await bycrypt.hash(manager.password!, 8);
  }

  next();
});

const Manager = model<ManagerDocument, ManagerModel>("Manager", managerSchema);

export default Manager;
