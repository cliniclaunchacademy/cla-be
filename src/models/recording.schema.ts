import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRecording extends Document {
  category: Types.ObjectId;
  title: string;
  subheading?: string;
  videoEmbed: string;
  recordedDate?: Date;
  status: 'published' | 'hidden';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const recordingSchema = new Schema<IRecording>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'RecordingCategory',
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
    videoEmbed: {
      type: String,
      required: true,
    },
    recordedDate: {
      type: Date,
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
    collection: 'recordings',
  }
);

export const Recording = mongoose.model<IRecording>('Recording', recordingSchema);
