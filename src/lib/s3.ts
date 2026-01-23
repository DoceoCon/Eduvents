import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as path from "path";

// Configure AWS
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION!,
});

type UploadResult = {
    url: string;
    key: string;
    bucket: string;
    contentType: string;
    originalFilename: string;
};

const getContentType = (filePath: string): string => {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
        // Images
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
        // Videos
        ".mp4": "video/mp4",
        ".mov": "video/quicktime",
        ".avi": "video/x-msvideo",
        ".webm": "video/webm",
        // Documents
        ".pdf": "application/pdf",
        ".doc": "application/msword",
        ".docx":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xls": "application/vnd.ms-excel",
        ".xlsx":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".csv": "text/csv",
        ".txt": "text/plain",
        // Audio types
        ".ogg": "audio/ogg",
        ".oga": "audio/ogg",
        // ".webm": "audio/webm",
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
        ".aac": "audio/aac",
    };

    return mimeTypes[ext] || "application/octet-stream";
};

// Function to upload file to S3
const uploadToS3 = async (
    filePath: string,
    folderName?: string
): Promise<UploadResult> => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error("File does not exist: " + filePath);
        }

        // Read file content
        const fileContent = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);

        const s3Key = folderName ? `${folderName}/${fileName}` : fileName;

        // Configure upload parameters
        const uploadParams: AWS.S3.Types.PutObjectRequest = {
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: s3Key,
            Body: fileContent,
            ContentType: getContentType(filePath),
            // ACL: "public-read",
        };

        console.log(`Uploading file: ${filePath}`);
        console.log(`S3 Key: ${s3Key}`);
        console.log(`Content Type: ${uploadParams.ContentType}`);

        // Upload to S3
        const result = await s3.upload(uploadParams).promise();

        console.log(`Upload successful. URL: ${result.Location}`);

        // Delete the local file after successful upload
        try {
            fs.unlinkSync(filePath);
            console.log(`Local file deleted: ${filePath}`);
        } catch (deleteError: any) {
            console.warn(
                `Warning: Could not delete local file: ${deleteError.message}`
            );
        }

        // Return result object
        return {
            url: result.Location,
            key: result.Key!,
            bucket: result.Bucket!,
            contentType: getContentType(filePath),
            originalFilename: fileName,
        };
    } catch (error: any) {
        console.error("Error uploading to S3:", {
            message: error.message,
            filePath,
            folderName,
        });

        // Try to clean up the file even if upload failed
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Cleaned up local file after error: ${filePath}`);
            }
        } catch (cleanupError: any) {
            console.warn(
                `Warning: Could not clean up local file: ${cleanupError.message}`
            );
        }

        throw error;
    }
};

const deleteFromS3 = async (key: string): Promise<void> => {
    try {
        const params: AWS.S3.Types.DeleteObjectRequest = {
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key,
        };

        console.log(`Deleting file from S3: ${key}`);
        await s3.deleteObject(params).promise();
        console.log(`File deleted successfully from S3: ${key}`);
    } catch (error: any) {
        console.error("Error deleting from S3:", {
            message: error.message,
            key,
        });
        // We don't necessarily want to throw here if the file is already gone
    }
};

export { uploadToS3, deleteFromS3 };
