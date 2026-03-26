import mongoose, { Document, Schema } from 'mongoose';

export interface IInstructor extends Document {
  firstName: string;
  lastName: string;
  title: string;
  bio?: string;
  photo?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const instructorSchema = new Schema<IInstructor>(
  {
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
    },
    photo: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'instructors',
  }
);

export const Instructor = mongoose.model<IInstructor>('Instructor', instructorSchema);
