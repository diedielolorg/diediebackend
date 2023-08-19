import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor';
import path from 'path';
import sharp from 'sharp';

@Injectable()
export class S3FileInterceptor extends FilesInterceptor('file', 3, {
  storage: multerS3({
    s3: new AWS.S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    }),
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    shouldTransform: true,
    transforms: [
      {
        id: 'resized',
        key: function (req, file, cb) {
          let extension = path.extname(file.originalname);
          cb(null, Date.now().toString() + extension);
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(100, 100)); // 이미지를 100x100 으로 리사이징
        },
      },
    ],
    key: function (request, file, cb) {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
}) {}
