import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'new_course' | 'new_lesson' | 'system_alert' | 'reminder' | 'achievement' | 'welcome' | 'custom';
  targetType: 'all' | 'user' | 'role';
  targetUsers?: Types.ObjectId[];
  targetRole?: 'student' | 'admin';
  status: 'sent' | 'failed';
  sentAt?: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['new_course', 'new_lesson', 'system_alert', 'reminder', 'achievement', 'welcome', 'custom'],
      required: true,
    },
    targetType: {
      type: String,
      enum: ['all', 'user', 'role'],
      required: true,
    },
    targetUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    targetRole: {
      type: String,
      enum: ['student', 'admin'],
    },
    status: {
      type: String,
      enum: ['sent', 'failed'],
      default: 'sent',
      required: true,
    },
    sentAt: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'notifications',
  }
);

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
