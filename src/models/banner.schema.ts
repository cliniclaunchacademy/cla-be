import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  imageUrl: string;
  label: string;
  status: 'active' | 'inactive';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'banners',
  }
);

export const Banner = mongoose.model<IBanner>('Banner', bannerSchema);
