import mongoose, { Document, Schema } from 'mongoose';

export interface IRecordingCategory extends Document {
  name: string;
  status: 'published' | 'hidden';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const recordingCategorySchema = new Schema<IRecordingCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    timestamps: true,
    collection: 'recording_categories',
  }
);

export const RecordingCategory = mongoose.model<IRecordingCategory>('RecordingCategory', recordingCategorySchema);
