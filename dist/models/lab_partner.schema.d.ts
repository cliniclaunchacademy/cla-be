import mongoose, { Document } from 'mongoose';
export interface ILabPartner extends Document {
    name: string;
    subheading?: string;
    logo?: string;
    portalUrl?: string;
    applicationEmbed?: string;
    status: 'live' | 'coming_soon' | 'maintenance';
    releaseDate?: Date;
    maintenanceMsg?: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const LabPartner: mongoose.Model<ILabPartner, {}, {}, {}, mongoose.Document<unknown, {}, ILabPartner, {}, {}> & ILabPartner & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=lab_partner.schema.d.ts.map