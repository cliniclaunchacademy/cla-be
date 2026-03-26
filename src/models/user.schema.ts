import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  role: 'student' | 'admin';
  status: 'active' | 'banned' | 'inactive';
  is_whitelisted: boolean;
  profilePhoto?: string;
  lastLogin?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  welcomeEmailSent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
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
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'banned', 'inactive'],
      default: 'active',
      required: true,
    },
    is_whitelisted: {
      type: Boolean,
      default: true,
    },
    profilePhoto: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
    welcomeEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

export const User = mongoose.model<IUser>('User', userSchema);
