import { supabase } from "../../../utils/supabase";

/**
 * Upload an image (local uri) to Supabase Storage and update the user's profile image.
 *
 * Inputs:
 *  - imageUri: local file URI (expo/image-picker or camera), or remote URL
 *  - userId: id of the user in the `users` table
 *
 * Output: public URL string of the uploaded image
 */
export async function uploadUserAvatar(
    imageUri: string,
    userId: string
): Promise<string> {
    try {
        if (!imageUri) throw new Error("imageUri is required");
        if (!userId) throw new Error("userId is required");

        // Derive file extension (fallback to jpg)
        const uriParts = imageUri.split(".");
        const lastPart = uriParts[uriParts.length - 1] || "jpg";
        const extMatch = lastPart.match(/(jpg|jpeg|png|gif|webp)$/i);
        const ext = extMatch ? extMatch[0].toLowerCase() : "jpg";

        const fileName = `${userId}-${Date.now()}.${ext}`;
        const filePath = `avatars/${fileName}`;

        // Convert local uri to Blob (works with fetch + RN url polyfill)
        const response = await fetch(imageUri);
        if (!response.ok)
            throw new Error(`Failed to fetch image at uri: ${imageUri}`);
        const blob = await response.blob();

        // Upload the blob to Supabase storage
        const { error: uploadError, data: uploadData } = await supabase.storage
            .from("avatars")
            .upload(filePath, blob, {
                cacheControl: "3600",
                upsert: true,
                contentType: blob.type || `image/${ext}`,
            });

        if (uploadError) {
            console.error("Supabase storage upload error:", uploadError);
            throw uploadError;
        }

        // Get public URL (getPublicUrl is synchronous)
        const { data: publicData } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);
        const publicUrl = publicData?.publicUrl ?? null;
        if (!publicUrl)
            throw new Error("Could not get public URL for uploaded avatar");

        // Update the user record
        const { error: updateError } = await supabase
            .from("users")
            .update({ image_profile: publicUrl })
            .eq("id", userId);

        if (updateError) {
            console.error("Supabase update user error:", updateError);
            throw updateError;
        }

        return publicUrl;
    } catch (err) {
        console.error("uploadUserAvatar error:", err);
        throw err;
    }
}
