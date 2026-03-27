import mongoose, { Document, Types } from 'mongoose';
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
export declare const Notification: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, {}> & INotification & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=notification.schema.d.ts.map