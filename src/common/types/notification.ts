import {MessageQueueType, NotificationChannel, NotificationStatus, NotificationType} from '../constants/constants';
import {Document, ObjectId} from 'mongoose';
import {IGrantsObject} from './auth';

export interface INotificationDocument {
  _id?: string | ObjectId
  messageId?: string;
  actor: {
    id: string;
    role: string;
    username: string;
    avatar: string;
  };

  payload: {
    message: string;
    extra?: Record<string, any>
  };
  type?: NotificationType;
  recipient: {
    id: string;
    role: string;
    username: string;
    avatar: string;
  };
  channel?: NotificationChannel;
  read?: boolean;
  delivered?: boolean;
  timestamp?: string;
}

export interface IEmailLog {
  _id: string;
  messageId: string;
  email: string;
  subject: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'sent' | 'failed';
  error?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IServerMessageQueue {
  type: MessageQueueType;
  permissions?: IGrantsObject;
}
