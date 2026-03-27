import mongoose, { Document, Types } from 'mongoose';
export interface ILesson extends Document {
    module: Types.ObjectId;
    course: Types.ObjectId;
    title: string;
    subheading?: string;
    videoEmbed?: string;
    status: 'published' | 'draft';
    comingSoon?: boolean;
    releaseDate?: Date;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Lesson: mongoose.Model<ILesson, {}, {}, {}, mongoose.Document<unknown, {}, ILesson, {}, {}> & ILesson & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=lesson.schema.d.ts.map