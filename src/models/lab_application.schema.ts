import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILabApplication extends Document {
  user: Types.ObjectId;
  lab: Types.ObjectId;
  // Flexible key-value store for the raw GHL webhook payload
  formData: Map<string, unknown>;
  // Raw email from the GHL form submission (for traceability)
  submittedEmail?: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
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
    formData: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    submittedEmail: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'in-review', 'approved', 'rejected'],
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
    toJSON: { flattenMaps: true },
    toObject: { flattenMaps: true },
  }
);

labApplicationSchema.index({ user: 1, lab: 1 }, { unique: true });

export const LabApplication = mongoose.model<ILabApplication>('LabApplication', labApplicationSchema);
