import {ObjectId} from 'mongoose';
import {
  MessageQueueType, NegotiationStatus, NegotiationType,
  OfferStatus,
  OrderEventType,
  OrderStatus,
  PaymentGateway,
  PaymentStatus
} from '../constants/constants';
import {IFile} from './cloudinary';
import {INotificationDocument} from './notification';

export interface IOffer {
  _id?: string | ObjectId
  orderId: string
  gigId: string;
  buyerId?: string;
  sellerId?: string;
  buyerEmail?: string;
  sellerEmail?: string;
  buyerUsername?: string;
  sellerUsername?: string;
  buyerPicture?: string;
  sellerPicture?: string;

  gigTitle: string;
  gigDescription?: string;
  gigCoverImage?: string;
  price: number;
  quantity: number;
  currency?: string;
  expectedDeliveryDays: number;
  status?: OfferStatus;
  canceledBy?: string | null;
  reason?: string | null;
}

export interface IRequestExtendedDelivery {
  _id?: string | ObjectId
  originalDate: string;
  newDate: string;
  expectedDeliveryDays: number;
  reason: string;
  approved?: boolean;
  approvedBy?: string;
  metadata?: Record<string, any>;
}

export interface IOrderReview {
  _id?: string | ObjectId,
  rating: number;
  review: string;
  timestamp?: string;
}

export interface IOrderEvent {
  type: OrderEventType;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface IOrderRequirement {
  requirementId: string;
  question: string;
  answerText?: string | null;
  answerFile?: IFile;
  answered: boolean;
  hasFile: boolean;
  required: boolean;
}


export interface IOrderMessageQueue {
  type?: MessageQueueType;
  messageId?: string;
  notification?: INotificationDocument;

  sellerId?: string;
  sellerEmail?: string;
  buyerId?: string;
  buyerEmail?: string;
  gigId?: string;

  ongoingJobs?: number;
  completedJobs?: number;
  purchasedGigs?: string;
  totalEarnings?: number;

  recentDelivery?: string;
  receiverEmail?: string;
  username?: string;
  template?: string;
  sender?: string;
  offerLink?: string;
  amount?: string;
  buyerUsername?: string;
  sellerUsername?: string;
  title?: string;
  description?: string;
  orderId?: string;
  invoiceId?: string;
  requirements?: string;

  expectedDeliveryDate?: string;
  originalDate?: string;
  expectedDeliveryDays?: number;
  newDate?: string;
  reason?: string;

  price?: number;
  quantity?: number;
  totalAmount?: number;
  serviceFee?: number;
  message?: string;

  orderUrl?: string;
  isCustomOffer?: boolean,
  job?: any,
}

export interface IDeliveredWork {
  _id?: string | ObjectId,
  message: string;
  files: IFile[];
  approved: boolean | null;
  approvedAt: string | Date;
  deliveredAt: string | Date;
  metadata: Record<string, any>;

  [key: string]: any;
}

export interface INegotiationDocument {
  _id?: string;
  orderId: string;
  type: NegotiationType;
  status: NegotiationStatus;
  requesterId: string;
  requesterRole: 'seller' | 'buyer';
  payload: {
    // Dành cho EXTEND_DELIVERY
    newDeliveryDays?: number;
    originalDeliveryDate?: string | Date;

    // Dành cho MODIFY_ORDER
    // newPrice?: number;
    // newScopeDescription?: string;

    // Dành cho CANCEL_ORDER
    reason?: string;
  };

  // --- Thời gian & Ghi chú ---
  message: string;
  createdAt: string | Date;
  respondedAt?: string | Date;

  disputeCaseId?: string;
}

export interface IOrderDocument {
  _id?: string | ObjectId;
  invoiceId: string;

  // References
  gigId: string;
  buyerId: string;
  sellerId: string;

  // Snapshot
  buyerUsername: string;
  buyerEmail: string;
  buyerPicture?: string;
  sellerUsername: string;
  sellerEmail: string;
  sellerPicture?: string;
  gigTitle: string;
  gigDescription: string;
  gigCoverImage?: string;

  // offer: IOffer;
  currency: string;
  quantity: number;
  price: number;
  serviceFee: number;
  totalAmount: number;

  status: OrderStatus;

  requirements?: IOrderRequirement[];

  isCustomOffer?: boolean;

  maxRevision: number | null;
  revisionCount?: number;
  deliveredWork: IDeliveredWork[];

  events: IOrderEvent[];

  buyerReview?: IOrderReview;
  sellerReview?: IOrderReview;

  approvedAt?: string;
  dateOrdered?: string;
  expectedDeliveryDate?: string;
  dueDate?: string;
  expectedDeliveryDays?: number;
  createdAt?: string;
  timeRemainingBeforePause?: number;

  currentNegotiationId?: string;
  negotiation?: INegotiationDocument;

  cancellationDetails?: {
    requestedBy: 'BUYER' | 'SELLER';
    reason: string;
  };

  disputeDetails?: {
    escalatedAt: string | Date;
    caseId: string;
  };

  [key: string]: any;
}

export interface IPaymentDocument {
  [key: string]: unknown;

  _id: string;
  parentPaymentId?: string | ObjectId;

  orderId: string | ObjectId;

  gateway: PaymentGateway;
  amount: number;
  currency: string;
  status: PaymentStatus;

  // Thông tin từ gateway
  transactionId?: string;   // ID của giao dịch từ gateway
  clientSecret?: string;    // Stripe
  paymentUrl?: string;      // VNPay/MoMo redirect URL
  // Metadata / optional
  metadata?: Record<string, any>;

  // Timestamps
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface ICostDetails {
  price: number;
  quantity: number;
  subtotal: number;
  serviceFee: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  taxBreakdown: Record<string, string | number>[]
}
