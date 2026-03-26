import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProgress extends Document {
  user: Types.ObjectId;
  course: Types.ObjectId;
  lesson: Types.ObjectId;
  completed: boolean;
  completedAt?: Date;
  lastWatched?: Date;
  flaggedVideo?: boolean;
}

const progressSchema = new Schema<IProgress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    lastWatched: {
      type: Date,
    },
    flaggedVideo: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'progress',
  }
);

progressSchema.index({ user: 1, course: 1, lesson: 1 }, { unique: true });

export const Progress = mongoose.model<IProgress>('Progress', progressSchema);
