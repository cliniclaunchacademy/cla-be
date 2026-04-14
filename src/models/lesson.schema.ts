import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILesson extends Document {
  module: Types.ObjectId;
  course: Types.ObjectId;
  title: string;
  subheading?: string;
  description?: string;
  thumbnail?: string;
  videoEmbed?: string;
  status: 'published' | 'draft';
  comingSoon?: boolean;
  releaseDate?: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    module: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subheading: {
      type: String,
    },
    description: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    videoEmbed: {
      type: String,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
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
    collection: 'lessons',
  }
);

export const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);
