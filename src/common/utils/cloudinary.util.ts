import {v4 as uuidv4} from 'uuid';
import {v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse, UploadResponseCallback} from 'cloudinary';
import {splitFileName} from './helper.util';
import {
  IFile, IUploadCloudinaryParams, CloudinaryResourceType, IUploadMultipleCloudinaryParams
} from '../types';
import {ApplicationError, FileTooLargeError} from '../../core';


export const getDownloadUrl = (publicId: string, resourceType: string, filename?: string) => {
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    flags: filename ? `attachment:${filename}` : 'attachment',
  });
};

export const uploadCloudinary = async (
  {
    file,
    publicId,
    folder,
    workerPool,
    overwrite = true,
    resourceType = 'auto',
    downloadable = true
  }: IUploadCloudinaryParams
): Promise<IFile> => {
  try {
    if (file.size >= 10485760)
      await Promise.reject(new FileTooLargeError({
        clientMessage: 'File too lagre, file must low than 10MB'
      }));
    let processedBuffer: Buffer;
    if (workerPool) {
      processedBuffer = (await workerPool.run(file.buffer)) as Buffer;
    } else {
      processedBuffer = file.buffer;
    }

    let finalResourceType: CloudinaryResourceType = resourceType ?? 'raw';
    if (!resourceType || resourceType === 'auto') {
      const mimeType = file.mimetype;
      if (mimeType.startsWith('image/')) finalResourceType = 'image';
      else if (mimeType.startsWith('video/') || mimeType.startsWith('audio/')) finalResourceType = 'video';
      else finalResourceType = 'raw';
    }

    const names = splitFileName(file.originalname);
    let finalPublicId = publicId ?? uuidv4();
    if (finalResourceType === 'raw')
      finalPublicId = names.ext ? `${finalPublicId}.${names.ext}` : finalPublicId;

    const uploadOptions: any = {
      folder,
      public_id: finalPublicId,
      resource_type: finalResourceType,
      overwrite,
      access_mode: "public",
    };

    const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(uploadOptions, (err?: UploadApiErrorResponse, callResult?: UploadApiResponse) => {
        if (err) {
          return reject(err);
        }
        return resolve(callResult!);
      }).end(processedBuffer);
    });


    const downloadLink = getDownloadUrl(uploadResult.public_id, finalResourceType, names.name);

    return {
      downloadUrl: downloadable ? downloadLink : '',
      secureUrl: uploadResult.secure_url,
      fileType: file.mimetype,
      fileSize: file.size,
      fileName: file.originalname,
      publicId: uploadResult.public_id
    };

  } catch (error) {
    if (error instanceof ApplicationError) throw error;
    throw new Error(`Upload failed for file ${file.originalname}`);
  }
};


export const uploadMultipleCloudinary = async (
  {
    files,
    folder,
    workerPool,
    handlePublicId,
    overwrite = true,
    resourceType,
    downloadable = true
  }: IUploadMultipleCloudinaryParams
): Promise<(IFile | { error: string, fileName: string })[]> => {

  return Promise.all(
    files.map(async (file, index) => {
      try {
        return await uploadCloudinary({
          file,
          publicId: handlePublicId ? handlePublicId(index) : undefined,
          folder,
          workerPool,
          overwrite,
          resourceType,
          downloadable
        });
      } catch (err: any) {
        return {error: err.message, fileName: file.originalname};
      }
    })
  );
};

