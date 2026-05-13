import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid'; // pnpm add uuid
import 'multer';

@Injectable()
export class S3Service {
    private s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.CLOUDFLY_REGION,
            endpoint: process.env.CLOUDFLY_ENDPOINT,
            credentials: {
                accessKeyId: process.env.CLOUDFLY_ACCESS_KEY!,
                secretAccessKey: process.env.CLOUDFLY_SECRET_KEY!,
            },
            forcePathStyle: true,
        });
    }

    async uploadFile(file: Express.Multer.File) {
        const key = `fakebook/${uuidv4()}-${file.originalname}`;
        const bucket = process.env.CLOUDFLY_BUCKET_NAME;

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read', // Để ảnh có thể xem được bằng URL công khai
            }),
        );

        return `https://s3.cloudfly.vn/${bucket}/${key}`;
    }
}
