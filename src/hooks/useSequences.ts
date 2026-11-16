import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSequence,
  deleteSequence,
  getSequence,
  listSequences,
  updateSequence,
} from "@/services/sequences";

const SEQUENCES_KEY = ["sequences"] as const;
const sequenceKey = (id: string) => ["sequences", id] as const;

export function useSequences() {
  return useQuery({ queryKey: SEQUENCES_KEY, queryFn: listSequences });
}

export function useSequence(id: string) {
  return useQuery({ queryKey: sequenceKey(id), queryFn: () => getSequence(id), enabled: !!id });
}

export function useCreateSequence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, description }: { title: string; description?: string }) =>
      createSequence(title, description),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SEQUENCES_KEY }),
  });
}

export function useUpdateSequence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      fields,
    }: {
      id: string;
      fields: { title?: string; description?: string | null };
    }) => updateSequence(id, fields),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: SEQUENCES_KEY });
      queryClient.invalidateQueries({ queryKey: sequenceKey(id) });
    },
  });
}

export function useDeleteSequence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSequence(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SEQUENCES_KEY }),
  });
}
