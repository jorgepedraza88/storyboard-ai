import { OPTION_MAPS } from "@/lib/shot-options";

const OPENROUTER_IMAGE_ENDPOINT = "https://openrouter.ai/api/v1/images";
const DEFAULT_MODEL =
  import.meta.env.VITE_OPENROUTER_IMAGE_MODEL || "google/gemini-2.5-flash-image-preview";

export const isOpenRouterConfigured = Boolean(import.meta.env.VITE_OPENROUTER_API_KEY);

export class OpenRouterError extends Error {}

export interface GeneratedImage {
  base64: string;
  mediaType: string;
}

export interface ShotPromptInput {
  description: string;
  shotType?: string | null;
  cameraAngle?: string | null;
  cameraMovement?: string | null;
  lens?: string | null;
  sequenceTitle?: string;
  sequenceLogline?: string | null;
}

function phrase(kind: keyof typeof OPTION_MAPS, value?: string | null) {
  if (!value) return "";
  return OPTION_MAPS[kind][value]?.prompt ?? "";
}

export function buildStoryboardPrompt(shot: ShotPromptInput): string {
  const details = [
    phrase("shotType", shot.shotType),
    phrase("cameraAngle", shot.cameraAngle),
    phrase("cameraMovement", shot.cameraMovement),
    phrase("lens", shot.lens),
  ]
    .filter(Boolean)
    .join(", ");

  const context = shot.sequenceLogline ? `Film context: ${shot.sequenceLogline}.` : "";

  return [
    "Black and white storyboard sketch panel for a film pre-production board.",
    "Hand-drawn look: loose graphite pencil and ink line art, rough hatching for shadows, minimal grayscale shading, sketchy but clear composition, no color whatsoever, monochrome.",
    "Cinematic 16:9 framing with clear staging and composition lines.",
    context,
    `Scene: ${shot.description || "a cinematic moment"}.`,
    details ? `Camera: ${details}.` : "",
    "Do not include any text, captions, watermarks, borders, or UI. Just the illustrated frame.",
  ]
    .filter(Boolean)
    .join(" ");
}

export async function generateStoryboardImage(
  shot: ShotPromptInput,
  opts?: { model?: string; aspectRatio?: string },
): Promise<GeneratedImage> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;
  if (!apiKey) {
    throw new OpenRouterError("Missing VITE_OPENROUTER_API_KEY");
  }

  const res = await fetch(OPENROUTER_IMAGE_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "Storyboard Studio",
    },
    body: JSON.stringify({
      model: opts?.model ?? DEFAULT_MODEL,
      prompt: buildStoryboardPrompt(shot),
      aspect_ratio: opts?.aspectRatio ?? "16:9",
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new OpenRouterError(
      body?.error?.message ?? `OpenRouter request failed (${res.status})`,
    );
  }

  const json = await res.json();
  const first = json.data?.[0];
  if (!first?.b64_json) {
    throw new OpenRouterError("OpenRouter response had no image data");
  }

  return { base64: first.b64_json, mediaType: first.media_type ?? "image/png" };
}
