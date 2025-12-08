import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role: 'student' | 'club-owner' | 'admin';
  subscription?: {
    plan: 'free' | 'basic' | 'premium';
    status: 'active' | 'cancelled' | 'expired';
    razorpaySubscriptionId?: string;
    razorpayCustomerId?: string;
    startDate?: Date;
    endDate?: Date;
    autoRenew?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['student', 'club-owner', 'admin'],
      default: 'student',
      required: true,
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'premium'],
        default: 'free',
      },
      status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
      },
      razorpaySubscriptionId: String,
      razorpayCustomerId: String,
      startDate: Date,
      endDate: Date,
      autoRenew: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
