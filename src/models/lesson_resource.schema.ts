import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILessonResource extends Document {
  lesson: Types.ObjectId;
  course: Types.ObjectId;
  title: string;
  type: 'file' | 'link' | 'pdf' | 'video';
  url: string;
  description?: string;
  status: 'published' | 'hidden';
  order: number;
  createdAt: Date;
}

const lessonResourceSchema = new Schema<ILessonResource>(
  {
    lesson: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
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
    type: {
      type: String,
      enum: ['file', 'link', 'pdf', 'video'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['published', 'hidden'],
      default: 'published',
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'lesson_resources',
  }
);

export const LessonResource = mongoose.model<ILessonResource>('LessonResource', lessonResourceSchema);
