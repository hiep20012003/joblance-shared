import { MessageQueueType } from "../../core";

export interface IReviewMessage {
  type: MessageQueueType;
  gigId?: string;
  reviewerId?: string;
  sellerId?: string;
  review?: string;
  rating?: number;
  orderId?: string;
  createdAt?: string;
}

export interface IRatingTypes {
  [key: string]: string;
}

export interface IReviewerObjectKeys {
  [key: string]: string | number | Date | undefined;
}

export interface IReviewDocument {
  _id?: string;
  gigId: string;
  reviewerId: string;
  sellerId: string;
  review: string;
  reviewerImage: string;
  rating: number;
  orderId: string;
  createdAt: Date | string;
  reviewerUsername: string;
  country: string;
  reviewType?: MessageQueueType;
}

export interface IRatingCategoryItem {
  value: number;
  count: number;
}

export interface IRatingCategories {
  five: IRatingCategoryItem;
  four: IRatingCategoryItem;
  three: IRatingCategoryItem;
  two: IRatingCategoryItem;
  one: IRatingCategoryItem;
}
