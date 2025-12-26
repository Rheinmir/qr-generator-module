import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a QR image (base64 data URL) to Cloudinary
 * @param {string} base64DataUrl - The base64 data URL of the QR image
 * @param {string} filename - A unique filename (without extension)
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadQRImage = async (base64DataUrl, filename) => {
  const result = await cloudinary.uploader.upload(base64DataUrl, {
    folder: "qr-generator",
    public_id: filename,
    tags: ["qr-batch", "auto_delete_30d"],
    resource_type: "image",
    overwrite: true,
  });
  return result.secure_url;
};

/**
 * Delete old QR images that are tagged for auto-deletion and older than specified days
 * Run this as a cron job if needed
 * @param {number} daysOld - Delete images older than this many days
 */
export const cleanupOldQRImages = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // Search for images with auto_delete tag that are old
    const result = await cloudinary.api.resources_by_tag("auto_delete_30d", {
      type: "upload",
      max_results: 500,
    });

    const toDelete = result.resources.filter((resource) => {
      const createdAt = new Date(resource.created_at);
      return createdAt < cutoffDate;
    });

    if (toDelete.length > 0) {
      const publicIds = toDelete.map((r) => r.public_id);
      await cloudinary.api.delete_resources(publicIds);
      console.log(
        `[Cloudinary Cleanup] Deleted ${publicIds.length} old QR images`
      );
    }

    return toDelete.length;
  } catch (error) {
    console.error("[Cloudinary Cleanup] Error:", error.message);
    return 0;
  }
};

export default cloudinary;
