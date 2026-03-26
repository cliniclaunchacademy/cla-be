import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILabApplication extends Document {
  user: Types.ObjectId;
  lab: Types.ObjectId;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  appliedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const labApplicationSchema = new Schema<ILabApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lab: {
      type: Schema.Types.ObjectId,
      ref: 'LabPartner',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
      required: true,
    },
    rejectionReason: {
      type: String,
    },
    appliedAt: {
      type: Date,
      required: true,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'lab_applications',
  }
);

labApplicationSchema.index({ user: 1, lab: 1 }, { unique: true });

export const LabApplication = mongoose.model<ILabApplication>('LabApplication', labApplicationSchema);
