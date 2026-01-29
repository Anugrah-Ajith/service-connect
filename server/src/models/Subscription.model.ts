import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  _id: string;
  customerId: mongoose.Types.ObjectId;
  planType: 'basic' | 'premium' | 'enterprise';
  serviceTypes: string[];
  monthlyPrice: number;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planType: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    required: true
  },
  serviceTypes: [{
    type: String
  }],
  monthlyPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

