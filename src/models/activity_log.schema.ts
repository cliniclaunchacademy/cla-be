import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IActivityLog extends Document {
  user: Types.ObjectId;
  lesson?: Types.ObjectId;
  course?: Types.ObjectId;
  action: 'watched' | 'completed' | 'login';
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    action: {
      type: String,
      enum: ['watched', 'completed', 'login'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'activity_logs',
  }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
