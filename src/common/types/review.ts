import {MessageQueueType, ReviewType} from '../constants/constants';
import {INotificationDocument} from './notification';

export interface IReviewMessageQueue {
  type: MessageQueueType;
  notification?: INotificationDocument;
  gigId?: string;
  reviewId?: string;
  reviewerId?: string;
  targetId?: string;
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
  id: string;
  orderId: string;
  gigId: string;
  reviewerId: string;
  reviewerUsername: string;
  targetId: string;
  targetUsername: string;
  review: string;
  rating: number;
  createdAt: Date | string;
  reply?: string;
  reviewType?: ReviewType;
  isPublic: boolean;

  [key: string]: any;
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
