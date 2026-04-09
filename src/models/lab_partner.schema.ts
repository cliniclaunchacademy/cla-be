import mongoose, { Document, Schema } from 'mongoose';

export interface ILabPartner extends Document {
  name: string;
  subheading?: string;
  logo?: string;
  portalUrl?: string;
  partnerUrl?: string;
  applicationEmbed?: string;
  status: 'live' | 'coming_soon' | 'maintenance';
  releaseDate?: Date;
  maintenanceMsg?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const labPartnerSchema = new Schema<ILabPartner>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subheading: {
      type: String,
    },
    logo: {
      type: String,
    },
    portalUrl: {
      type: String,
    },
    partnerUrl: {
      type: String,
    },
    applicationEmbed: {
      type: String,
    },
    status: {
      type: String,
      enum: ['live', 'coming_soon', 'maintenance'],
      required: true,
    },
    releaseDate: {
      type: Date,
    },
    maintenanceMsg: {
      type: String,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'lab_partners',
  }
);

export const LabPartner = mongoose.model<ILabPartner>('LabPartner', labPartnerSchema);
