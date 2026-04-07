import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunityLink extends Document {
  imageUrl: string;
  discord?: string;
  order: number;
  active: boolean;
  createdAt: Date;
}

const communityLinkSchema = new Schema<ICommunityLink>(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    discord: {
      type: String,
    },
    order: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'community_links',
  }
);

export const CommunityLink = mongoose.model<ICommunityLink>('CommunityLink', communityLinkSchema);
