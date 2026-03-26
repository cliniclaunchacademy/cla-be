import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminSettings extends Document {
  discordInviteUrl?: string;
  supportEmail?: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  updatedAt: Date;
}

const adminSettingsSchema = new Schema<IAdminSettings>(
  {
    discordInviteUrl: {
      type: String,
    },
    supportEmail: {
      type: String,
    },
    maintenanceMode: {
      type: Boolean,
      required: true,
      default: false,
    },
    maintenanceMessage: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
    collection: 'admin_settings',
  }
);

export const AdminSettings = mongoose.model<IAdminSettings>('AdminSettings', adminSettingsSchema);
