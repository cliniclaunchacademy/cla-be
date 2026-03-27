import mongoose, { Document, Types } from 'mongoose';
export interface IRecording extends Document {
    category: Types.ObjectId;
    title: string;
    subheading?: string;
    videoEmbed: string;
    recordedDate?: Date;
    status: 'published' | 'hidden';
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Recording: mongoose.Model<IRecording, {}, {}, {}, mongoose.Document<unknown, {}, IRecording, {}, {}> & IRecording & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=recording.schema.d.ts.map