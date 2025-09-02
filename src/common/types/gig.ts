import { ObjectId } from "mongoose";
import { MessageQueueType } from "../../core";
import { IRatingCategories } from "./review";

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
  ratingsCount?: number; // elasticsearch as a double
  ratingSum?: number; // elasticsearch as a double
  ratingCategories?: IRatingCategories;
  expectedDelivery: string;
  basicTitle: string;
  basicDescription: string;
  price: number;
  coverImage: string;
  createdAt?: Date | string;
  sortId?: number;
  toJSON?: () => unknown; // use for add document to elasticsearch with "_id" was replaced by "id"
}

export interface IGigMessage{
  type?: MessageQueueType;
  purchasedGigId?: string;
  buyerId?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  country?: string;
  isSeller?: boolean;
}
