import mongoose, { Document, Types } from 'mongoose';
export interface IActivityLog extends Document {
    user: Types.ObjectId;
    lesson?: Types.ObjectId;
    course?: Types.ObjectId;
    action: 'watched' | 'completed' | 'login';
    createdAt: Date;
}
export declare const ActivityLog: mongoose.Model<IActivityLog, {}, {}, {}, mongoose.Document<unknown, {}, IActivityLog, {}, {}> & IActivityLog & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=activity_log.schema.d.ts.map