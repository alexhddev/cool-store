import type { S3Handler } from 'aws-lambda';
import { S3 } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const s3 = new S3();
const THUMBNAIL_WIDTH = 100; // You can adjust this size
const THUMBNAIL_HEIGHT = 100;
const IMAGES_PREFIX = 'images'
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

            const imageObject = await s3.getObject({
                Bucket: bucketName,
                Key: key
            })

            if (!imageObject.Body) {
                throw new Error('No image data received from S3');
            }

            // Convert the image body to buffer
            const imageBuffer = Buffer.from(await imageObject.Body.transformToByteArray());

            // Generate thumbnail
            const thumbnailBuffer = await sharp(imageBuffer)
                .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
                    fit: 'cover',
                    withoutEnlargement: true
                })
                .toBuffer();

            // remove the prefix from the key
            const keyWithoutPrefix = key.replace(`${IMAGES_PREFIX}/`, '');

            const thumbnailKey = `${THUMBNAIL_PREFIX}/${keyWithoutPrefix}`;

            // Upload the thumbnail to S3
            await s3.putObject({
                Bucket: bucketName,
                Key: thumbnailKey,
                Body: thumbnailBuffer,
                ContentType: 'image/jpeg' // Adjust content type as needed
            });

            console.log(`Successfully created thumbnail for ${keyWithoutPrefix}`);




        }

    } catch (error) {
        console.error('Error processing image:', error);
    }

};

function decodeKeys(undecodedKeys: string[]): string[] {
    return undecodedKeys.map((key) => decodeURIComponent(key.replace(/\+/g, ' ')));
}