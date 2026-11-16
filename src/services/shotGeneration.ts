import { STORYBOARD_IMAGES_BUCKET, supabase } from "@/lib/supabase";
import { generateStoryboardImage, OpenRouterError } from "@/lib/openrouter";
import { updateShotStatus } from "@/services/shots";
import type { Sequence, Shot } from "@/types/database";

function base64ToBlob(base64: string, mediaType: string): Blob {
  const bytes = atob(base64);
  const array = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    array[i] = bytes.charCodeAt(i);
  }
  return new Blob([array], { type: mediaType });
}

function extensionFor(mediaType: string): string {
  return mediaType.split("/")[1] || "png";
}

export async function generateShotImage(shot: Shot, sequence?: Sequence): Promise<Shot> {
  try {
    await updateShotStatus(shot.id, "generating");

    const { base64, mediaType } = await generateStoryboardImage({
      description: shot.description,
      shotType: shot.camera_shot_type,
      cameraAngle: shot.camera_angle,
      cameraMovement: shot.camera_movement,
      lens: shot.lens,
      sequenceTitle: sequence?.title,
      sequenceLogline: sequence?.description,
    });
    const blob = base64ToBlob(base64, mediaType);
    const path = `${shot.sequence_id}/${shot.id}.${extensionFor(mediaType)}`;

    const { error: uploadError } = await supabase.storage
      .from(STORYBOARD_IMAGES_BUCKET)
      .upload(path, blob, { upsert: true, contentType: mediaType });
    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from(STORYBOARD_IMAGES_BUCKET)
      .getPublicUrl(path);

    // Cache-bust so a regenerated image at the same path re-renders immediately.
    const imageUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

    return await updateShotStatus(shot.id, "done", { image_url: imageUrl, error_message: null });
  } catch (err) {
    const message = err instanceof OpenRouterError ? err.message : (err as Error).message;
    return await updateShotStatus(shot.id, "error", { error_message: message });
  }
}
