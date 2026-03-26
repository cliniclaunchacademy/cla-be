import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotificationRead extends Document {
  notification: Types.ObjectId;
  user: Types.ObjectId;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
}

const notificationReadSchema = new Schema<INotificationRead>(
  {
    notification: {
      type: Schema.Types.ObjectId,
      ref: 'Notification',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'notification_reads',
  }
);

notificationReadSchema.index({ notification: 1, user: 1 }, { unique: true });
notificationReadSchema.index({ user: 1, createdAt: -1 });

export const NotificationRead = mongoose.model<INotificationRead>('NotificationRead', notificationReadSchema);
