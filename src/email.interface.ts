export interface IBaseEmailLocals {
  appLink: string;
  appIcon: string;
  subject?: string;
  header?: string;
  message?: string;
  sender?: string;
}

export interface IAuthEmailLocals extends IBaseEmailLocals {
  username: string;
  verifyLink?: string;
  resetLink?: string;
  otp?: string;
}

export interface IOrderEmailLocals extends IBaseEmailLocals {
  orderId: string;
  orderUrl?: string;
  orderDue?: string;
  deliveryDays?: string;
  title?: string;
  description?: string;
  price?: string;
  serviceFee?: string;
  totalPrice?: string;
  buyerUsername?: string;
  sellerUsername?: string;
  requirements?: string;
}

export interface IOrderUpdateEmailLocals extends IOrderEmailLocals {
  originalDate?: string;
  newDate?: string;
  reason?: string;
  type?: string;
}

export interface IPromotionEmailLocals extends IOrderEmailLocals {
  offerLink?: string;
}
