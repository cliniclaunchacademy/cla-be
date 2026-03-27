import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    role: 'student' | 'admin';
    status: 'active' | 'banned' | 'inactive';
    is_whitelisted: boolean;
    profilePhoto?: string;
    lastLogin?: Date;
    resetToken?: string;
    resetTokenExpiry?: Date;
    welcomeEmailSent?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=user.schema.d.ts.map