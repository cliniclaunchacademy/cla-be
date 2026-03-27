import mongoose, { Document, Types } from 'mongoose';
export interface ILessonResource extends Document {
    lesson: Types.ObjectId;
    course: Types.ObjectId;
    title: string;
    type: 'file' | 'link' | 'pdf' | 'video';
    url: string;
    description?: string;
    status: 'published' | 'hidden';
    order: number;
    createdAt: Date;
}
export declare const LessonResource: mongoose.Model<ILessonResource, {}, {}, {}, mongoose.Document<unknown, {}, ILessonResource, {}, {}> & ILessonResource & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=lesson_resource.schema.d.ts.map