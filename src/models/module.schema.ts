import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IModule extends Document {
  course: Types.ObjectId;
  title: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema = new Schema<IModule>(
  {
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
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'modules',
  }
);

export const Module = mongoose.model<IModule>('Module', moduleSchema);
