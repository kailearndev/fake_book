import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';
import 'multer';

@Injectable()
export class UploadService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadImages(files: Array<Express.Multer.File>) {
    return Promise.all(files.map((file) => this.s3Service.uploadFile(file)));
  }
}
