import type { S3Handler } from 'aws-lambda';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Jimp, JimpMime } from "jimp";

const s3Client = new S3Client();
const THUMBNAIL_WIDTH = 100; // You can adjust this size
const THUMBNAIL_HEIGHT = 100;
const IMAGES_PREFIX = 'originals'
const THUMBNAIL_PREFIX = 'thumbs'

export const handler: S3Handler = async (event) => {

    try {
        const bucketName = event.Records[0].s3.bucket.name
        const objectKeys = event.Records.map((record) => record.s3.object.key);

        const keys = decodeKeys(objectKeys);

        for (const key in keys) {
            if (key.startsWith(THUMBNAIL_PREFIX)) {
                continue;
            }

            const getObjectCommand = new GetObjectCommand({
                Bucket: bucketName,
                Key: key                
            })

            const imageObject = await s3Client.send(getObjectCommand)

            if (!imageObject.Body) {
                throw new Error('No image data received from S3');
            }

            // Convert the image body to buffer
            const imageBuffer = Buffer.from(await imageObject.Body.transformToByteArray());

            // Generate thumbnail
            const thumbnailBuffer = await resizeImage(imageBuffer);

            // remove the prefix from the key
            const keyWithoutPrefix = key.replace(`${IMAGES_PREFIX}/`, '');

            const thumbnailKey = `${THUMBNAIL_PREFIX}/${keyWithoutPrefix}`;

            // Upload the thumbnail to S3
            const putObjectCommand = new PutObjectCommand({
                Bucket: bucketName,
                Key: thumbnailKey,
                Body: thumbnailBuffer,
                ContentType: 'image/jpeg' // Adjust content type as needed
            });

            await s3Client.send(putObjectCommand)

            console.log(`Successfully created thumbnail for ${keyWithoutPrefix}`);




        }

    } catch (error) {
        console.error('Error processing image:', error);
    }

};

function resizeImage(imageBuffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        Jimp.read(imageBuffer)
            .then((image) => {
                image.resize({w:THUMBNAIL_WIDTH})
                image.getBuffer(JimpMime.png, (err: Error, buffer:Buffer) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(buffer);
                    }
                });
            })
            .catch((err) => reject(err));
    });
}

function decodeKeys(undecodedKeys: string[]): string[] {
    return undecodedKeys.map((key) => decodeURIComponent(key.replace(/\+/g, ' ')));
}