import mongoose, { Document, Types } from 'mongoose';
export interface ICourse extends Document {
    title: string;
    subheading?: string;
    about?: string;
    thumbnail?: string;
    banner?: string;
    instructor: Types.ObjectId;
    status: 'published' | 'unpublished' | 'draft';
    comingSoon: boolean;
    releaseDate?: Date;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Course: mongoose.Model<ICourse, {}, {}, {}, mongoose.Document<unknown, {}, ICourse, {}, {}> & ICourse & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=course.schema.d.ts.map