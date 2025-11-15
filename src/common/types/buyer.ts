import {ObjectId} from 'mongoose';
import {MessageQueueType} from '../constants/constants';

export interface IBuyerDocument {
  _id?: string | ObjectId;
  username?: string;
  email?: string;
  profilePicture?: string;
  profilePublicId?: string;
  sex?: string;
  country?: string;
  isSeller?: boolean;
  purchasedGigs: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IBuyerMessageQueue {
  type?: MessageQueueType;
  purchasedGigId?: string;
  buyerId?: string;
  username?: string;
  email?: string;
  sex?: string;
  profilePicture?: string;
  country?: string;
  isSeller?: boolean;
}

