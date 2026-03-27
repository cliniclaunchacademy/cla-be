import mongoose, { Document } from 'mongoose';
export interface IInstructor extends Document {
    firstName: string;
    lastName: string;
    title: string;
    bio?: string;
    photo?: string;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}
export declare const Instructor: mongoose.Model<IInstructor, {}, {}, {}, mongoose.Document<unknown, {}, IInstructor, {}, {}> & IInstructor & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=instructor.schema.d.ts.map