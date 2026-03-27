import mongoose, { Document, Types } from 'mongoose';
export interface IModule extends Document {
    course: Types.ObjectId;
    title: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Module: mongoose.Model<IModule, {}, {}, {}, mongoose.Document<unknown, {}, IModule, {}, {}> & IModule & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=module.schema.d.ts.map