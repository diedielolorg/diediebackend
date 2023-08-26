"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FileInterceptor = void 0;
const common_1 = require("@nestjs/common");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const files_interceptor_1 = require("@nestjs/platform-express/multer/interceptors/files.interceptor");
const path_1 = require("path");
const sharp_1 = require("sharp");
let S3FileInterceptor = exports.S3FileInterceptor = class S3FileInterceptor extends (0, files_interceptor_1.FilesInterceptor)('file', 3, {
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
                    let extension = path_1.default.extname(file.originalname);
                    cb(null, Date.now().toString() + extension);
                },
                transform: function (req, file, cb) {
                    cb(null, (0, sharp_1.default)().resize(100, 100));
                },
            },
        ],
        key: function (request, file, cb) {
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
}) {
};
exports.S3FileInterceptor = S3FileInterceptor = __decorate([
    (0, common_1.Injectable)()
], S3FileInterceptor);
//# sourceMappingURL=S3FileInterceptor.js.map