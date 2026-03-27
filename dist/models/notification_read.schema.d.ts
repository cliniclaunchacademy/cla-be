import mongoose, { Document, Types } from 'mongoose';
export interface INotificationRead extends Document {
    notification: Types.ObjectId;
    user: Types.ObjectId;
    read: boolean;
    readAt?: Date;
    createdAt: Date;
}
export declare const NotificationRead: mongoose.Model<INotificationRead, {}, {}, {}, mongoose.Document<unknown, {}, INotificationRead, {}, {}> & INotificationRead & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=notification_read.schema.d.ts.map