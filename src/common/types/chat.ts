import {ObjectId, Schema} from "mongoose";
import {IOffer} from './order';
import {MessageQueueType, MessageType} from '../constants/constants';
import {IFile} from './cloudinary';
import {INotificationDocument} from './notification';

export interface IChatMessageQueue {
  type?: MessageQueueType;
  notification?: INotificationDocument;
  message?: IMessageDocument;
  conversation?: IConversationDocument;
  actorId: string;

  [key: string]: any
}

export interface IConversationDocument {
  _id: string,
  participants: string[];
  lastMessage?: {
    _id: string;
    content: string;
    senderId: string;
    timestamp: string;
  };
  unreadCounts: Map<string, number> | Record<string, number>;
  isArchived: Map<string, boolean> | Record<string, boolean>;
  createdAt: Date | string;
  updatedAt: Date | string;
}


export interface IMessageDocument {
  _id: string,
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  metadata: any;
  read: boolean;
  readAt: string | null;
  attachments: IFile[];
  isDeleted: boolean; // Xóa mềm
  timestamp: Date | string;
}
