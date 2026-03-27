import mongoose, { Document, Types } from 'mongoose';
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
export declare const LabApplication: mongoose.Model<ILabApplication, {}, {}, {}, mongoose.Document<unknown, {}, ILabApplication, {}, {}> & ILabApplication & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=lab_application.schema.d.ts.map