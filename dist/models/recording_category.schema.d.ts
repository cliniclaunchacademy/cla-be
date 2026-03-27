import mongoose, { Document } from 'mongoose';
export interface IRecordingCategory extends Document {
    name: string;
    status: 'published' | 'hidden';
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const RecordingCategory: mongoose.Model<IRecordingCategory, {}, {}, {}, mongoose.Document<unknown, {}, IRecordingCategory, {}, {}> & IRecordingCategory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=recording_category.schema.d.ts.map