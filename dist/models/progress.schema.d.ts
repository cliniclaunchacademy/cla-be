import mongoose, { Document, Types } from 'mongoose';
export interface IProgress extends Document {
    user: Types.ObjectId;
    course: Types.ObjectId;
    lesson: Types.ObjectId;
    completed: boolean;
    completedAt?: Date;
    lastWatched?: Date;
    flaggedVideo?: boolean;
}
export declare const Progress: mongoose.Model<IProgress, {}, {}, {}, mongoose.Document<unknown, {}, IProgress, {}, {}> & IProgress & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=progress.schema.d.ts.map