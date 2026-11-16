import { supabase } from "@/lib/supabase";
import type { Shot, ShotStatus } from "@/types/database";

const POSITION_STEP = 1000;

export interface ShotFields {
  title: string;
  description: string;
  camera_shot_type: string | null;
  camera_angle: string | null;
  camera_movement: string | null;
  lens: string | null;
  duration: number;
  dialogue: string | null;
  purpose: string | null;
}

export async function listShots(sequenceId: string): Promise<Shot[]> {
  const { data, error } = await supabase
    .from("shots")
    .select("*")
    .eq("sequence_id", sequenceId)
    .order("position", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createShot(sequenceId: string, fields: ShotFields): Promise<Shot> {
  const { data: existing, error: fetchError } = await supabase
    .from("shots")
    .select("position")
    .eq("sequence_id", sequenceId)
    .order("position", { ascending: false })
    .limit(1);
  if (fetchError) throw fetchError;

  const nextPosition = (existing?.[0]?.position ?? 0) + POSITION_STEP;

  const { data, error } = await supabase
    .from("shots")
    .insert({
      sequence_id: sequenceId,
      position: nextPosition,
      ...fields,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateShotFields(id: string, fields: ShotFields): Promise<Shot> {
  const { data, error } = await supabase
    .from("shots")
    .update(fields)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateShotPosition(id: string, position: number): Promise<Shot> {
  const { data, error } = await supabase
    .from("shots")
    .update({ position })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateShotStatus(
  id: string,
  status: ShotStatus,
  fields?: { image_url?: string | null; error_message?: string | null },
): Promise<Shot> {
  const { data, error } = await supabase
    .from("shots")
    .update({ status, ...fields })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteShot(id: string): Promise<void> {
  const { error } = await supabase.from("shots").delete().eq("id", id);
  if (error) throw error;
}
