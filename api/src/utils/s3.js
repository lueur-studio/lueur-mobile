const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const crypto = require("crypto");

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (fileBuffer, mimetype, originalname) => {
  const fileExtension = originalname.split(".").pop();
  const fileName = `${crypto.randomBytes(16).toString("hex")}.${fileExtension}`;
  const key = `photos/${Date.now()}-${fileName}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://${process.env.AWS_S3_BUCKET}.s3.${
      process.env.AWS_REGION || "us-east-1"
    }.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload image to S3");
  }
};

const deleteFromS3 = async (fileUrl) => {
  try {
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(params));
    return true;
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error("Failed to delete image from S3");
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3,
};
