import {ObjectId} from "mongoose";
import {IRatingCategories} from "./review";
import {MessageQueueType} from '../constants/constants';

export interface IRequirementQuestion {
  _id?: string | ObjectId
  question: string;
  hasFile: boolean;
  required: boolean;
}

export interface IGigDocument {
  _id?: string | ObjectId;
  id?: string | ObjectId; // use for elasticsearch
  sellerId?: string | ObjectId;
  title: string;
  username?: string;
  profilePicture?: string;
  email?: string;
  description: string;
  active?: boolean;
  categories: string;
  subCategories: string[];
  tags: string[];
  activeOrderCount?: number; // elasticsearch as a double
  ratingsCount?: number; // elasticsearch as a double
  ratingSum?: number; // elasticsearch as a double
  ratingCategories?: IRatingCategories;
  expectedDeliveryDays: number | string;
  basicTitle: string;
  basicDescription: string;
  price: number;
  currency?: string;
  coverImage: string;
  requirements: IRequirementQuestion[];
  isDeleted?: boolean;
  createdAt?: Date | string;
  deletedAt?: Date | string | null;
  sortId?: number;
  toJSON?: () => unknown; // use for add document to elasticsearch with "_id" was replaced by "id"
}

export interface IGigMessageQueue {
  type?: MessageQueueType;
  gigCount?: number;
  sellerId?: string;

  purchasedGigId?: string;
  buyerId?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  country?: string;
  isSeller?: boolean;
}
