import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  subheading?: string;
  about?: string;
  thumbnail?: string;
  banner?: string;
  instructor: Types.ObjectId;
  status: 'published' | 'unpublished' | 'draft';
  comingSoon: boolean;
  releaseDate?: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subheading: {
      type: String,
    },
    about: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    banner: {
      type: String,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'Instructor',
      required: true,
    },
    status: {
      type: String,
      enum: ['published', 'unpublished', 'draft'],
      default: 'draft',
      required: true,
    },
    comingSoon: {
      type: Boolean,
      default: false,
    },
    releaseDate: {
      type: Date,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'courses',
  }
);

export const Course = mongoose.model<ICourse>('Course', courseSchema);
