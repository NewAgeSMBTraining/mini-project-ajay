import { Document, Model, model, ObjectId, Schema } from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";

export enum Gender {
  "male",
  "female",
  "transsexual",
}

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  dob: Date;
  gender: Gender;
  phoneNumber: string;
  address: string;
  social: [{ title: string; url: string }];
  academicQualifications: [
    {
      degreeCertificate: string;
      qualifications: string;
      institute: string;
      boardUniversity: string;
      year: string;
      percentageCgpa: string;
    }
  ];
  workExperience: [{ company: string; role: string; year: string }];
  manager: string;
  leaveRequests: ObjectId[];
  blocked?: boolean;
  tokens?: { token: string }[];
  resetTokens?: { token: string }[];
  generateAuthToken(): string;
  generateResetToken(): string;
  getPublicProfile(): UserDocument;
}

export interface UserModel extends Model<UserDocument> {
  findByCredentials(email: string, password: string): UserDocument;
}

const userSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxLength: 21,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxLength: 21,
  },
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
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value: any) {
      if (!validator.isStrongPassword(value.toString()))
        throw new Error("password is invalid");
    },
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  dob: {
    type: Date,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value: any) {
      if (
        Gender[value.toString().toLowerCase()] === undefined ||
        Gender[value.toString().toLowerCase()] === null
      )
        throw new Error("not a valid gender");
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
  address: {
    type: String,
    required: true,
    trim: true,
  },
  social: [
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      url: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  academicQualifications: [
    {
      degreeCertificate: {
        type: String,
        required: true,
        trim: true,
      },
      qualifications: {
        type: String,
        required: true,
        trim: true,
      },
      institute: {
        type: String,
        required: true,
        trim: true,
      },
      boardUniversity: {
        type: String,
        required: true,
        trim: true,
      },
      year: {
        type: String,
        required: true,
        trim: true,
      },
      percentageCgpa: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  workExperience: [
    {
      company: {
        type: String,
        required: true,
        trim: true,
      },
      role: {
        type: String,
        required: true,
        trim: true,
      },
      year: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],

  manager: {
    required: true,
    trim: true,
    type: String,
  },

  blocked: {
    default: false,
    type: Boolean,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  resetTokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  leaveRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "Leave",
    },
  ],
});

userSchema.statics.findByCredentials = async function (
  email: string,
  password: string
) {
  const user: UserDocument | null = await User.findOne({ email });
  if (!user) throw new Error("unable to login");

  const isMatch = await bycrypt.compare(password, user.password!);
  if (!isMatch) throw new Error("unable to login");

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user: UserDocument = this as UserDocument;
  const token: string = jwt.sign(
    {
      _id: user._id,
    },
    process.env.TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  user.tokens = user.tokens!.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.generateResetToken = async function () {
  const user: UserDocument = this as UserDocument;
  const token: string = jwt.sign(
    {
      _id: user._id,
    },
    process.env.TOKEN_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  user.resetTokens = user.resetTokens!.concat({ token });
  await user.save();

  const encryptedToken = await bycrypt.hash(token, 8);
  return encryptedToken;
};

userSchema.methods.getPublicProfile = async function () {
  const user: UserDocument = this as UserDocument;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.blocked;
  delete userObject.resetTokens;

  return userObject;
};

userSchema.pre("save", async function (next) {
  const user: UserDocument = this as UserDocument;

  if (user.isModified("password")) {
    user.password = await bycrypt.hash(user.password!, 8);
  }

  if (user.isModified("address")) {
    let _address = "";
    user.address
      .split(" ")
      .forEach(
        (v, i) => (_address = _address + " " + v[0].toUpperCase() + v.slice(1))
      );
    user.address = _address;
  }

  next();
});

const User = model<UserDocument, UserModel>("User", userSchema);

export default User;
