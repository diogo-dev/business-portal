import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable, Put } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
    private  s3Client: S3Client;
    private region: string;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        this.region = this.configService.getOrThrow<string>('AWS_REGION');
        this.bucketName = this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');
        this.s3Client = new S3Client({ region: this.region })
    }

    async uploadImage(fileName: string, fileBuffer: Buffer): Promise<string> {

        // Validate type of file (mime type validate using interceptor in controller, with pipe it didn't work well)
        // Optimize image (resize with sharp)
        // Generate unique file name with randomUUID and timestamp

        const uniqueFileName = `${randomUUID()}-${Date.now()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: uniqueFileName,
            Body: fileBuffer
        });

        await this.s3Client.send(command);

        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${uniqueFileName}`;
    }

    async deleteImage(imageUrl: string): Promise<void> {
        try {
            const key = imageUrl.split('.amazonaws.com/')[1];

            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            await this.s3Client.send(command);
        } catch (error) {
            console.error('Error deleting image:', error);
            throw new BadRequestException('Failed to delete image');
        }
    }

}
