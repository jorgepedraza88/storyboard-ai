import { supabase } from "@/lib/supabase";
import type { Sequence } from "@/types/database";

export async function listSequences(): Promise<Sequence[]> {
  const { data, error } = await supabase
    .from("sequences")
    .select("*")
    .order("title", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getSequence(id: string): Promise<Sequence> {
  const { data, error } = await supabase.from("sequences").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createSequence(title: string, description?: string): Promise<Sequence> {
  const { data, error } = await supabase
    .from("sequences")
    .insert({ title, description: description ?? null })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateSequence(
  id: string,
  fields: { title?: string; description?: string | null },
): Promise<Sequence> {
  const { data, error } = await supabase
    .from("sequences")
    .update(fields)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSequence(id: string): Promise<void> {
  const { error } = await supabase.from("sequences").delete().eq("id", id);
  if (error) throw error;
}
