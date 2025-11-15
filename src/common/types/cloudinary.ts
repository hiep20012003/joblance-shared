import Piscina from 'piscina';
import {UploadApiErrorResponse} from 'cloudinary';

export interface IUploadMultipleCloudinaryParams {
  files: Express.Multer.File[];
  folder?: string;
  workerPool?: Piscina;
  handlePublicId?: (index: number) => string;
  overwrite?: boolean;
  resourceType: CloudinaryResourceType;
  downloadable?: boolean;
}
export type CloudinaryResourceType = 'image' | 'video' | 'raw' | 'auto';

export interface IUploadCloudinaryParams {
  file: Express.Multer.File;
  publicId?: string;
  folder?: string;
  workerPool?: Piscina;
  overwrite?: boolean;
  resourceType: CloudinaryResourceType;
  downloadable?: boolean;
}

export interface IUploadCloudinaryError {
  file: IFile;
  error?: UploadApiErrorResponse;
  message: string;
}

export interface IFile{
  secureUrl?: string;
  downloadUrl?: string;
  fileType: string;
  fileSize: number;
  fileName: string;
  publicId?: string;
}
