import mongoose, { Document } from 'mongoose';
export interface IBanner extends Document {
    imageUrl: string;
    label: string;
    status: 'active' | 'inactive';
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Banner: mongoose.Model<IBanner, {}, {}, {}, mongoose.Document<unknown, {}, IBanner, {}, {}> & IBanner & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=banner.schema.d.ts.map