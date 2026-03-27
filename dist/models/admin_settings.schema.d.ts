import mongoose, { Document } from 'mongoose';
export interface IAdminSettings extends Document {
    discordInviteUrl?: string;
    supportEmail?: string;
    maintenanceMode: boolean;
    maintenanceMessage?: string;
    updatedAt: Date;
}
export declare const AdminSettings: mongoose.Model<IAdminSettings, {}, {}, {}, mongoose.Document<unknown, {}, IAdminSettings, {}, {}> & IAdminSettings & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=admin_settings.schema.d.ts.map