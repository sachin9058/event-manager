import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClub extends Document {
  name: string;
  description: string;
  category: string;
  createdBy: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  logo?: string;
  isActive: boolean;
  inviteToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClubSchema: Schema<IClub> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Cultural', 'Technical', 'Sports', 'Academic', 'Social', 'Other'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    logo: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    inviteToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

const Club: Model<IClub> = mongoose.models.Club || mongoose.model<IClub>('Club', ClubSchema);

export default Club;
